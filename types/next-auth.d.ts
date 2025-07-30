import "next-auth";

declare module 'next-auth' {
  interface Session {
    address?: string;
    id?: string; // Optional: if you want to include user ID in the session
  }
}