import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account || !user.email) return true;
      
      try {
        // Sync user with backend to get UUID
        const response = await fetch(`${API_URL}/users/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            image: user.image,
            provider: account.provider,
            provider_id: user.id,
          }),
        });

        if (response.ok) {
          const userData = await response.json();
          // Store backend UUID in user object for later use
          user.backendId = userData.id;
        }
      } catch (error) {
        console.error('Failed to sync user with backend:', error);
      }
      
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.userId = user.id;
        // Store the backend UUID in the token
        token.backendId = (user as any).backendId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
         // @ts-ignore - OAuth provider ID
        session.user.id = token.userId as string;
         // @ts-ignore - Backend UUID
        session.user.backendId = token.backendId as string;
         // @ts-ignore
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
};
