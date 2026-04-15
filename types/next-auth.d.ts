import 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      role?: string;
    };
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}

