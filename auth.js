import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { normalizarEmail } from "@/lib/validar";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = normalizarEmail(credentials?.email);
        const password = credentials?.password;

        if (!email || !password) return null;

        // LOWER(email) para que el login no dependa de mayúsculas.
        const [user] = await sql`
          SELECT id, username, email, password_hash, role
          FROM users
          WHERE LOWER(email) = ${email}
        `;

        if (!user) return null;

        const passwordValida = await bcrypt.compare(
          password,
          user.password_hash,
        );
        if (!passwordValida) return null;

        return {
          id: String(user.id),
          name: user.username,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
