import { NextResponse } from "next/server";
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

  User.findByIdAndUpdate(
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
