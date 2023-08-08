import { NextResponse } from "next/server";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { User } from "mongo/mongo";
import { SessionWithId, User as UserType } from "@/app/types";

export async function GET(request: Request, response: Response) {
  const session = (await getServerSession(authOptions)) as SessionWithId;
  if (!session) {
    return NextResponse.json(
      { message: "You have to be logged in for this..." },
      { status: 401 }
    );
  }

  const user = (await User.findOne({ _id: session.user?.id })) as UserType;

  if (user.twoFactorAuth) {
    return NextResponse.json(
      { message: "You already have 2FA enabled", ok: true },
      { status: 200 }
    );
  }

  const secret = speakeasy.generateSecret({
    name: "Account Manager",
  });

  const data_url = await qrcode.toDataURL(secret.otpauth_url as string);

  return NextResponse.json(
    { message: "", secret: secret.base32, qr_code: data_url },
    { status: 200 }
  );
}
