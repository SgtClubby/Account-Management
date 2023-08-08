import { NextResponse } from "next/server";
import speakeasy from "speakeasy";
import { User } from "../../../../../mongo/mongo";
import { User as UserType } from "@/app/types";
export async function POST(request: Request, response: Response) {
  const { secret, token, id } = await request.json();

  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: token,
  });

  const dbuser = (await User.findById(id)) as UserType;

  if (verified) {
    if (!dbuser.twoFactorAuth) {
      await User.updateOne(
        { _id: id },
        {
          $set: {
            twoFactorAuth: true,
            twoFactorAuthSecret: secret,
          },
        }
      );
    }

    return NextResponse.json({ verified: true });
  } else {
    return NextResponse.json({ verified: false });
  }
}
