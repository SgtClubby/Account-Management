import { NextResponse } from "next/server";
import { EmailCheck, User } from "../../../../mongo/mongo";
import { hash } from "bcrypt";
import { randomBytes } from "crypto";
import AccountManagementVerifyEmail from "./verifyEmail";
import type { Body, User as UserType } from "../../types";
import { Resend } from "resend";

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

  const userEmailCheck = await User.findOne({ email });
  if (userEmailCheck) {
    return NextResponse.json(
      { message: "Email already in use.", ok: false, status: 400 },
      { status: 400 }
    );
  }

  const token = randomBytes(16).toString("hex");

  const newUser = new User({
    username: un as string,
    email: email as string,
    password: await hash(pw, 10),
    twoFactorAuth: false,
    twoFactorAuthSecret: null,
    emailVerified: false,
  });

  const id = newUser._id.toHexString() as string;

  const emailCheck = new EmailCheck({
    id,
    token,
  });

  await emailCheck.save();
  await newUser.save();

  const resend = new Resend(process.env.RESEND_KEY as string);

  const user = {
    token,
    id,
    username: un,
    baseUrl: process.env.NEXTAUTH_URL as string,
  };

  console.log("LOG: Tried to send email to " + email);
  resend.sendEmail({
    from: "noreply@verify.metrix.pw",
    to: email,
    subject: "Verify your email",
    react: AccountManagementVerifyEmail({ user }),
  });

  return NextResponse.json(
    {
      message: "Success! You will be forwarded soon!",
      ok: true,
      status: 200,
    },
    { status: 200 }
  );
}
