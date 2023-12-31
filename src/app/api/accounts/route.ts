import { NextResponse } from "next/server";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { Account, User } from "../../../../mongo/mongo";
import { AES } from "crypto-js";
import type {
  InputBoxStateProps,
  SessionWithId,
  UploadedFileProps,
  User as UserType,
} from "../../types";

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

  const username = body.username as string;
  const encPassword = body.encPassword as string;
  const fields = body.fields as InputBoxStateProps[];
  const files = body.files as UploadedFileProps[];

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
  try {
    const newAccount = new Account({
      owner: session?.user?.id,
      username,
      password: encPassword,
      fields: fields,
      files: files,
    });

    await newAccount.save();

    return NextResponse.json(
      {
        message: "Success!",
        ok: true,
        status: 200,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error!",
        ok: false,
        status: 500,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, response: Response) {
  const session = (await getServerSession(authOptions)) as SessionWithId;
  if (!session) {
    return NextResponse.json({ message: "Unauthenicated" }, { status: 401 });
  }

  const body = await request.json();

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
