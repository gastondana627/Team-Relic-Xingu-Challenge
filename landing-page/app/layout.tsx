import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team Relic - The Xingu Discovery",
  description: "An AI-enhanced archaeological survey into the Amazon, submitted for the OpenAI to Z Challenge.",
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
