import { NextResponse } from "next/server";
import { User } from "../../../../mongo/mongo";
import { Resend } from "resend";
import AccountManagementVerifyEmail from "../register/verifyEmail";
import { randomBytes } from "crypto";
import { EmailCheck } from "../../../../mongo/email";
import { logger } from "lib/logger";

export async function PUT(request: Request, response: Response) {
  const body = await request.json();
  const token = body.token;
  const id = body.id;

  if (!id || !token)
    return NextResponse.json(
      {
        message: "Missing fields!",
        ok: false,
        status: 400,
      },
      { status: 400 }
    );

  const checkIfTokenExists = await EmailCheck.findOne({ token });

  if (!checkIfTokenExists)
    return NextResponse.json(
      {
        message: "Invalid token!",
        ok: false,
        status: 400,
      },
      { status: 400 }
    );

  // update user to verified
  await User.updateOne(
    { _id: id },
    {
      $set: {
        emailVerified: true,
      },
    }
  );

  // delete token
  await EmailCheck.deleteOne({ id });

  return NextResponse.json(
    {
      message: "Success!",
      ok: true,
      status: 200,
    },
    { status: 200 }
  );
}

export async function POST(request: Request, response: Response) {
  const body = await request.json();

  const id = body.id;

  if (!id)
    return NextResponse.json(
      {
        message: "Missing fields!",
        ok: false,
        status: 400,
      },
      { status: 400 }
    );

  const userdb = await User.findById({ _id: id });
  const resend = new Resend(process.env.RESEND_KEY as string);

  if (!userdb)
    return NextResponse.json(
      {
        message: "User not found!",
        ok: false,
        status: 404,
      },
      { status: 404 }
    );

  if (userdb.emailVerified)
    return NextResponse.json(
      {
        message: "Email already verified!",
        ok: false,
        status: 400,
      },
      { status: 400 }
    );

  const verifyCheck = await EmailCheck.findOne({ id });
  if (verifyCheck) {
    return NextResponse.json(
      {
        message: "Email already sent!",
        ok: false,
        status: 400,
      },
      { status: 400 }
    );
  }

  const token = randomBytes(16).toString("hex");

  const emailCheck = new EmailCheck({
    id,
    token,
  });

  await emailCheck.save();

  const user = {
    token,
    id,
    username: userdb.username,
    baseUrl: process.env.NEXTAUTH_URL as string,
  };

  logger(
    `Sending email verification to ${userdb.email}, with link ${process.env.NEXTAUTH_URL}/verify/${user.id}/${token}`,
    "info"
  );
  const from = `verify@${process.env.EMAIL_DOMAIN}`;

  resend.sendEmail({
    from,
    to: userdb.email,
    subject: "Verify your email",
    react: AccountManagementVerifyEmail({ user }),
  });

  return NextResponse.json(
    {
      message: "Success!",
      ok: true,
      status: 200,
    },
    { status: 200 }
  );
}
