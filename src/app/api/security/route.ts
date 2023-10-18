import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { SessionWithId, SecurityLevel } from "@/app/types";
import { User } from "../../../../mongo/mongo";

export async function POST(request: Request, response: Response) {
  const session = (await getServerSession(authOptions)) as SessionWithId;
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const level: number = parseInt(body.level);
  const user = await User.findOne({ _id: session?.user?.id });

  if (!user) {
    return NextResponse.json({ message: "User not found!" }, { status: 404 });
  }

  console.log(level);
  const updated = await User.updateOne(
    { _id: session?.user?.id },
    { $set: { accountSecurityLevel: level } }
  );

  if (updated.acknowledged == false) {
    return NextResponse.json(
      { message: "Error updating security level" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: `Success! Security level updated to ${SecurityLevel[level]}!`,
      ok: true,
      status: 200,
    },
    { status: 200 }
  );
}
