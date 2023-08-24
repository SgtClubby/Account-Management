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

  const user = await User.findById(
    { _id: session?.user?.id },
    { password: 0, _id: 0, __v: 0, salt: 0, twoFactorAuthSecret: 0 }
  );

  return NextResponse.json(
    {
      user,
      ok: true,
    },
    { status: 200 }
  );
}

export async function PATCH(request: Request, response: Response) {
  const session = (await getServerSession(authOptions)) as SessionWithId;
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const username = body.username;
  const email = body.email;

  if (username) {
    const check = await User.findOne({ username });

    if (check) {
      return NextResponse.json(
        {
          ok: false,
          message: "Username already taken",
        },
        { status: 200 }
      );
    }

    await User.updateOne({ _id: session?.user?.id }, { $set: { username } });
  }

  if (email) {
    const check = await User.findOne({ email });

    if (check) {
      return NextResponse.json(
        {
          ok: false,
          message: "Email already in use",
        },
        { status: 200 }
      );
    }

    await User.updateOne(
      { _id: session?.user?.id },
      { $set: { emailVerified: false, email } }
    );
  }

  if (username || email) {
    return NextResponse.json(
      {
        ok: true,
      },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      {
        message: "Nothing to update",
        ok: false,
      },
      { status: 200 }
    );
  }
}
