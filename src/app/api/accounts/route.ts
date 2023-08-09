import { NextResponse } from "next/server";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { Account, User } from "../../../../mongo/mongo";
import { AES } from "crypto-js";
import type { SessionWithId, User as UserType } from "../../types";

export async function GET(request: Request, response: Response) {
  const session = (await getServerSession(authOptions)) as SessionWithId;
  if (!session) {
    return NextResponse.json({ message: "Unauthenicated" }, { status: 401 });
  }

  const accounts = await Account.find(
    { owner: session?.user?.id },
    { _id: 0, __v: 0, owner: 0 }
  );

  if (!accounts) {
    return NextResponse.json({ message: "No accounts found" }, { status: 404 });
  }

  return NextResponse.json({ accounts: accounts }, { status: 200 });
}

export async function POST(request: Request, response: Response) {
  const session = (await getServerSession(authOptions)) as SessionWithId;
  if (!session) {
    return NextResponse.json({ message: "Unauthenicated" }, { status: 401 });
  }

  const body = await request.json();

  const usedFor = body.usedFor;
  const username = body.username;
  const encPassword = body.encPassword;
  const name = body.accountName;

  const user = (await User.findOne({ _id: session.user?.id })) as UserType;

  if (!user) {
    return NextResponse.json(
      {
        message: "User not found",
        ok: false,
        status: 404,
      },
      { status: 404 }
    );
  }

  const newAccount = new Account({
    usedFor,
    username,
    password: encPassword,
    name,
    owner: session?.user?.id,
  });

  return newAccount
    .save()
    .then(() => {
      return NextResponse.json(
        {
          message: "Success!",
          ok: true,
          status: 200,
        },
        { status: 200 }
      );
    })
    .catch((e: any) => {
      return console.log(e);
    });
}

export async function DELETE(request: Request, response: Response) {
  const session = (await getServerSession(authOptions)) as SessionWithId;
  if (!session) {
    return NextResponse.json({ message: "Unauthenicated" }, { status: 401 });
  }

  const body = await request.json();
  console.log(body);

  const username = body.username;

  await Account.deleteOne({ username });

  return NextResponse.json(
    {
      message: "Success!",
      ok: true,
      status: 200,
    },
    { status: 200 }
  );
}
