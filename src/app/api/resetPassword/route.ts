import { NextResponse } from "next/server";
import { User } from "../../../../mongo/mongo";
import { hash, compare } from "bcrypt";
import { PasswordReset } from "../../../../mongo/reset";

export async function POST(request: Request, response: Response) {
  const body = await request.json();

  // password reset from email
  if (body.token) {
    const reqToken = body.token;

    // check token
    const token = await PasswordReset.findOne({ token: reqToken });

    if (!token) {
      return NextResponse.json(
        {
          message: "Invalid token!",
          ok: false,
          status: 400,
        },
        { status: 400 }
      );
    }

    const newPassword = await hash(body.newPassword, 10);

    await User.updateOne(
      { email: token.email },
      {
        $set: {
          password: newPassword,
        },
      }
    );

    await PasswordReset.deleteOne({ token: reqToken });

    return NextResponse.json(
      {
        message: "Success! Password changed.",
        ok: true,
        status: 200,
      },
      { status: 200 }
    );
  }

  const oldPw = body.oldPassword;
  const newPw = body.newPassword;
  const id = body.id;

  if (!oldPw || !newPw || !id) {
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

  const passwordCheck = await compare(oldPw, dbuser.password);

  if (!passwordCheck) {
    return NextResponse.json(
      { message: "Old password is wrong!", ok: false, status: 400 },
      { status: 400 }
    );
  }

  const newPassword = await hash(newPw, 10);

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
      message: "Success! Password changed.",
      ok: true,
      status: 200,
    },
    { status: 200 }
  );
}
