import { NextResponse } from "next/server";
import speakeasy from "speakeasy";
import { User } from "../../../../../mongo/mongo";
import { AES, enc } from "crypto-js";
import { UserBackend } from "@/app/types";

export async function POST(request: Request, response: Response) {
  const body = await request.json();

  const token = body.token;
  const id = body.id;

  if (!id) return NextResponse.json({ message: "Missing id", verified: false });
  if (!token)
    return NextResponse.json({ message: "Missing token", verified: false });

  const dbuser = (await User.findById(id)) as UserBackend;

  const secret = AES.decrypt(
    dbuser.twoFactorAuthSecret,
    dbuser.salt.toString() + process.env.PEPPER!
  ).toString(enc.Utf8);

  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: token,
  });

  if (!verified) {
    return NextResponse.json({ verified: false });
  }

  return NextResponse.json({ verified: true });
}
