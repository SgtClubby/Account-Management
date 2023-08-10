import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { User } from "mongo/mongo";
import { SessionWithId, User as UserType } from "@/app/types";

export async function GET(request: Request, response: Response) {
  const session = (await getServerSession(authOptions)) as SessionWithId;
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById({ _id: session?.user?.id });

  return NextResponse.json(
    {
      user: {
        twoFa: {
          twoFactorAuthEnabled: user?.twoFactorAuth,
          details: {
            message: user?.twoFactorAuth
              ? "Two factor authentication is enabled"
              : "Two factor authentication is disabled",
            status: user?.twoFactorAuth,
          },
        },
        email: {
          emailVerified: user?.emailVerified,
          details: {
            message: user?.emailVerified
              ? null
              : "You need to verify your email, please check your inbox or spam folder!",
            status: user?.emailVerified,
          },
        },
      },
      ok: true,
    },
    { status: 200 }
  );
}
