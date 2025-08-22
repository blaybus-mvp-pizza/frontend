import { Session, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  providers: [
    CredentialsProvider({
      name: "ID/PW",
      credentials: {
        id: { label: "id", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, _) {
        const { id, password } = credentials || {};
        if (!id || !password) return null;
        const admin = await prisma.admin.findUnique({
          where: { nickname: id },
        });
        if (!admin) return null;
        const isPasswordValid = password === admin.password;
        if (!isPasswordValid) return null;

        const accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

        return {
          id: admin.nickname,
          role: admin.role,
          accessToken: accessToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "SUPERADMIN" | "ADMIN";
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
};
