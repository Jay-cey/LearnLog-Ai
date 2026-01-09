import 'next-auth';

declare module 'next-auth' {
  interface User {
    backendId?: string;
  }
  
  interface Session {
    user: {
      id: string;
      backendId?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    backendId?: string;
    accessToken?: string;
  }
}
