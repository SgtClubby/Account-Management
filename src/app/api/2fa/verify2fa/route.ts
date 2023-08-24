import { NextResponse } from "next/server";
import speakeasy from "speakeasy";
import { User } from "../../../../../mongo/mongo";
import { User as UserType } from "@/app/types";
import { genSalt } from "bcrypt";
import { AES, enc } from "crypto-js";

export async function POST(request: Request, response: Response) {
  const body = await request.json();

  const secret = body.secret;
  const token = body.token;
  const id = body.id;

  if (!id) return NextResponse.json({ message: "Missing id", verified: false });
  if (!token)
    return NextResponse.json({ message: "Missing token", verified: false });
  if (!secret)
    return NextResponse.json({ message: "Missing secret", verified: false });

  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: token,
  });

  const salt = await genSalt(10);
  const pepper = process.env.PEPPER as string;
  const dbuser = (await User.findById(id)) as UserType;

  const encryptedSecret = AES.encrypt(
    secret,
    salt.toString() + pepper
  ).toString();

  if (verified) {
    if (!dbuser.twoFactorAuth) {
      await User.updateOne(
        { _id: id },
        {
          $set: {
            twoFactorAuth: true,
            twoFactorAuthSecret: encryptedSecret,
            salt,
          },
        }
      );
    } else {
      return NextResponse.json({ message: "Already enabled", verified: true });
    }

    return NextResponse.json({ verified: true });
  } else {
    return NextResponse.json({ verified: false });
  }
}
