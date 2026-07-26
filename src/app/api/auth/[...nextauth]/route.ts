import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        mode: { label: "Mode", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email.toLowerCase().trim();
        const mode = credentials.mode || "signin";

        if (mode === "signup") {
          const existing = await db.user.findUnique({ where: { email } });
          if (existing) throw new Error("Email already in use");
          if (!credentials.name || credentials.name.trim().length < 1) {
            throw new Error("Please enter your name");
          }
          if (credentials.password.length < 6) {
            throw new Error("Password must be at least 6 characters");
          }
          const passwordHash = await bcrypt.hash(credentials.password, 10);
          const user = await db.user.create({
            data: {
              email,
              name: credentials.name.trim(),
              passwordHash,
            },
          });
          return { id: user.id, email: user.email, name: user.name };
        }

        const user = await db.user.findUnique({ where: { email } });
        if (!user) throw new Error("No account found with that email");
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) throw new Error("Incorrect password");
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
