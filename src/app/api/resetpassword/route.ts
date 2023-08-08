import { NextResponse } from "next/server";
import { User } from "../../../../mongo/mongo";
import { hash, compare } from "bcrypt";

export async function POST(request: Request, response: Response) {
  const body = await request.json();

  const un = body.password;
  const pw = body.newPassword;
  const id = body.id;

  if (!un || !pw || !id) {
    return NextResponse.json(
      { message: "Please fill all fields.", ok: false, status: 400 },
      { status: 400 }
    );
  }

  const dbuser = await User.findById(id);

  if (!dbuser) {
    return NextResponse.json(
      { message: "User not found.", ok: false, status: 400 },
      { status: 400 }
    );
  }

  const passwordCheck = await compare(un, dbuser.password);

  if (!passwordCheck) {
    return NextResponse.json(
      { message: "Wrong password.", ok: false, status: 400 },
      { status: 400 }
    );
  }

  const newPassword = await hash(pw, 10);

  await User.updateOne(
    { _id: id },
    {
      $set: {
        password: newPassword,
      },
    }
  );

  return NextResponse.json(
    {
      message: "Success! You will be forwarded soon!",
      ok: true,
      status: 200,
    },
    { status: 200 }
  );
}
