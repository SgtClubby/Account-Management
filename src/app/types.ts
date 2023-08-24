import { Session } from "next-auth";

export type Body = {
  email: string;
  username: string;
  password: string;
};

export type UploadedFileProps = {
  id: string;
  fileName: string;
  type: string;
  size: number;
  data: string;
};

export type Account = {
  id: string;
  username: string;
  password: string;
  fields?: [
    {
      id: string;
      value: string;
      name: string;
    }
  ];
  files?: [
    {
      id: string;
      fileName: string;
      size: number;
      type: string;
      data: string;
    }
  ];
};

export type Field = {
  id: string;
  value: string;
  name: string;
};

export type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  twoFactorAuth: Boolean;
  emailVerified: Boolean;
};

export type UserBackend = {
  _id: string;
  username: string;
  email: string;
  password: string;
  twoFactorAuth: Boolean;
  emailVerified: Boolean;
  twoFactorAuthSecret: string;
  salt: string;
};

export interface SessionWithId extends Session {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export type MeResponse = {
  user: User;
};

export type InputBoxStateProps = {
  value: string;
  name: string;
  id: string;
};

export type SubmittedAccountProps = {
  username: string;
  password: string;
  fields: InputBoxStateProps[];
};
