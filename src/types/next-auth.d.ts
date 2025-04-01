import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from 'next-auth';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
} 