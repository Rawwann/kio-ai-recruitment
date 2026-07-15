import { authOptions } from "@/lib/auth/auth-options";
import NextAuth from "next-auth";

const authHandler = NextAuth(authOptions);

export { authHandler as GET, authHandler as POST }