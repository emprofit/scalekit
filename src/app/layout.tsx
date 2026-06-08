import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScaleKit",
  description:
    "A secure digital product selling platform for checkout, payments, downloads, and order verification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}