import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";

const defaultFont = Josefin_Sans({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-josefin",
  display: "swap",
  fallback: ["sans-serif"],
});

export const metadata: Metadata = {
  title: "votale",
  description: "A collaborative writing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${defaultFont.variable} text-sm bg-background-primary text-text-primary h-screen`}
      >
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
