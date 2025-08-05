import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
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
        {children}
      </body>
    </html>
  );
}
