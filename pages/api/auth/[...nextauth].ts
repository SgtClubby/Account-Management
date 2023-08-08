import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User as UserDB, Account } from "../../../mongo/mongo";
import { compare, hash } from "bcrypt";
import speakeasy from "speakeasy";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        "2fa-key": { label: "2FA Key" },
      },
      async authorize(credentials, req) {
        const dbuser = await UserDB.findOne({
          username: credentials?.username,
        });

        if (!dbuser) {
          return null;
        }

        if (dbuser.twoFactorAuth) {
          const verified = speakeasy.totp.verify({
            secret: dbuser.twoFactorAuthSecret,
            encoding: "base32",
            token: credentials?.["2fa-key"] as string,
          });

          if (!verified) {
            return null;
          }
        }

        const isValid = await compare(
          credentials?.password as string,
          dbuser?.password
        );

        if (isValid) {
          return dbuser;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      /* @ts-expect-error Assigning database id to session object */
      session.user.id = token.sub;
      return session;
    },
  },
  secret: process.env.SECRET,
  pages: {
    signIn: "/login",
  },
  jwt: {
    maxAge: 3600,
  },
  session: {
    maxAge: 3600,
  },
};
export default NextAuth(authOptions);
