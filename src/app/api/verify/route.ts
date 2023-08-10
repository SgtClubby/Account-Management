import { NextResponse } from "next/server";
import { User, EmailCheck } from "../../../../mongo/mongo";
import { Resend } from "resend";
import AccountManagementVerifyEmail from "../register/verifyEmail";
import { randomBytes } from "crypto";

export async function PUT(request: Request, response: Response) {
  const body = await request.json();
  const token = body.token;
  const id = body.id;

  const checkIfTokenExists = await EmailCheck.findOne({ token, id });

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

  // Delete old token if exists
  await EmailCheck.deleteOne({ id });

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

  console.log("LOG: Tried to send email to " + userdb.email);

  resend.sendEmail({
    from: "noreply@verify.metrix.pw",
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
