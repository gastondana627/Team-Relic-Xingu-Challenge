import type { Metadata } from "next";
import "./globals.css";

// This is the updated metadata for your project
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
      {/* The body no longer needs the custom font variables */}
      <body>{children}</body>
    </html>
  );
}

