import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// --- THIS IS THE UPDATED METADATA ---
export const metadata: Metadata = {
  title: "Relic",
  description: "An AI-enhanced archaeological survey into the Amazon, submitted for the OpenAI to Z Challenge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
