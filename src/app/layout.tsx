import "./globals.css";
import type { Metadata } from "next";
import Providers from "./Providers";
export const metadata: Metadata = {
  title: "Account Management",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <body>{children}</body>
      </html>
    </Providers>
  );
}
