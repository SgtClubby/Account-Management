import { NextResponse } from "next/server";
import { User } from "../../../../mongo/mongo";
import { EmailCheck } from "../../../../mongo/email";
import { hash } from "bcrypt";
import { randomBytes } from "crypto";
import AccountManagementVerifyEmail from "./verifyEmail";
import type { Body, UserBackend, User as UserType } from "../../types";
import { Resend } from "resend";
import { logger } from "lib/logger";

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

  logger(
    `Sending email verification to ${email}, with link ${process.env.NEXTAUTH_URL}/verify/${user.id}/${token}}`,
    "info"
  );

  const from = `verify@${process.env.EMAIL_DOMAIN}`;

  try {
    resend.sendEmail({
      from,
      to: email,
      subject: "Verify your email",
      react: AccountManagementVerifyEmail({ user }),
    });
  } catch (e) {
    console.log(e);
  }

  return NextResponse.json(
    {
      message: "Success! You will be forwarded soon!",
      ok: true,
      status: 200,
    },
    { status: 200 }
  );
}
