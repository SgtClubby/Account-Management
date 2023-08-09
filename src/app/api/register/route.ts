import { NextResponse } from "next/server";
import { User } from "../../../../mongo/mongo";
import { hash } from "bcrypt";

type Body = {
  email: string;
  username: string;
  password: string;
};

export async function POST(request: Request, response: Response) {
  const body: Body = await request.json();

  const email = body.email.trim();
  const un = body.username.trim();
  const pw = body.password;

  if (!un || !pw || !email) {
    return NextResponse.json(
      { message: "Please fill all fields.", ok: false, status: 400 },
      { status: 400 }
    );
  }

  const usernameCheck = await User.findOne({ username: un });
  if (usernameCheck) {
    return NextResponse.json(
      { message: "Username already in use.", ok: false, status: 400 },
      { status: 400 }
    );
  }

  const emailCheck = await User.findOne({ email });
  if (emailCheck) {
    return NextResponse.json(
      { message: "Email already in use.", ok: false, status: 400 },
      { status: 400 }
    );
  }

  const newUser = new User({
    username: un as string,
    email: email as string,
    password: await hash(pw, 10),
    twoFactorAuth: false,
    twoFactorAuthSecret: null,
  });

  return newUser
    .save()
    .then(() => {
      return NextResponse.json(
        {
          message: "Success! You will be forwarded soon!",
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
