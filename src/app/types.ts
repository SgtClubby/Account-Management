import { Session } from "next-auth";

type Body = {
  email: string;
  username: string;
  password: string;
};

export type Account = {
  id: string;
  name: string;
  username: string;
  password: string;
  usedFor: string;
};

export type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  twoFactorAuth: Boolean;
};

export interface SessionWithId extends Session {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}
