import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { User } from "mongo/mongo";
import speakeasy from "speakeasy";
import { SessionWithId, User as UserType } from "@/app/types";
import { decrypt } from "lib/functions";

export async function DELETE(request: Request, response: Response) {
  const session = (await getServerSession(authOptions)) as SessionWithId;
  if (!session) {
    return NextResponse.json(
      { message: "You have to be logged in for this..." },
      { status: 401 }
    );
  }
  const body = await request.json();
  const token = body.token;

  const salt = (await User.findById(session?.user?.id))?.salt;
  const authSecret = (await User.findById(session?.user?.id))
    ?.twoFactorAuthSecret;

  if (!salt || !authSecret) {
    return NextResponse.json(
      { message: "You have to be logged in for this..." },
      { status: 401 }
    );
  }

  const secret = decrypt(authSecret, salt + process.env.PEPPER);

  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: token,
  });

  if (!verified) {
    return NextResponse.json(
      { message: "Invalid token", ok: false },
      { status: 401 }
    );
  }

  await User.findByIdAndUpdate(
    { _id: session?.user?.id },
    {
      twoFactorAuth: false,
      twoFactorAuthSecret: "",
    }
  );

  return NextResponse.json(
    { message: "2FA removed", ok: true },
    { status: 200 }
  );
}
