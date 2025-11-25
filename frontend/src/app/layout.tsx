import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ReduxProvider } from "./providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Video Transcription & Analysis",
  description: "Upload, transcribe, and analyze video recordings with AI-powered insights",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ReduxProvider>
          {children}
          <Toaster position="top-right" />
        </ReduxProvider>
      </body>
    </html>
  );
}
