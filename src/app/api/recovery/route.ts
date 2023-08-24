import { NextResponse } from "next/server";
import { User } from "../../../../mongo/mongo";
import { Resend } from "resend";
import { randomBytes } from "crypto";
import { PasswordReset } from "../../../../mongo/reset";
import AccountManagementPasswordReset from "./passwordRecoveryEmail";
import { logger } from "lib/logger";

export async function POST(request: Request, response: Response) {
  const body = await request.json();

  const email = body.email;
  const reqToken = body.token;

  if (reqToken) {
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

    return NextResponse.json(
      {
        ok: true,
        status: 200,
      },
      { status: 200 }
    );
  }

  if (!email)
    return NextResponse.json(
      {
        message: "Missing email!",
        ok: false,
        status: 400,
      },
      { status: 400 }
    );

  const userdb = await User.findOne({ email: email });
  // As to not leak emails, we don't want to tell the user if the email is in use or not.
  // Soft return.
  if (!userdb) return NextResponse.json({ ok: true });

  const resend = new Resend(process.env.RESEND_KEY as string);
  const token = randomBytes(16).toString("hex");

  const passwordReset = new PasswordReset({
    email,
    token,
  });

  await passwordReset.save();

  const user = {
    token,
    email,
    username: userdb.username,
    baseUrl: process.env.NEXTAUTH_URL as string,
  };

  logger(
    `Sending password reset email to ${userdb.email}, with link http://localhost:3000/reset-password/${token}`,
    "info"
  );

  const from = `password-reset@${process.env.EMAIL_DOMAIN}`;

  resend.sendEmail({
    from,
    to: userdb.email,
    subject: "Reset your password for Metrix",
    react: AccountManagementPasswordReset({ user }),
  });

  return NextResponse.json(
    {
      ok: true,
    },
    { status: 200 }
  );
}
