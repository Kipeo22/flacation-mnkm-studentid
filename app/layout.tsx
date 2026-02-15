import type { Metadata } from "next";
import { Geist, Geist_Mono, Shippori_Mincho } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const shippori = Shippori_Mincho({
    weight: ["400", "500", "600", "700", "800"],
    subsets: ["latin"],
    variable: "--font-serif",
    display: "swap",
});


export const metadata: Metadata = {
  title: "Flashami学園 学生証",
  description: "Student ID Card for Flashami Academy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${shippori.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
