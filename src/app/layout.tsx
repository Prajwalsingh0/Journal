import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import BloomApp from "./BloomApp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bloom Journal - Your Safe Space to Grow",
  description: "A supportive journaling community for young women to express themselves, connect, and build community through shared experiences.",
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌸</text></svg>" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="pastel">
      <body className={`${geistSans.variable} antialiased bg-background text-foreground`}>
        <BloomApp />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}