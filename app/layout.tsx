import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PT. Reliable Future Technology | Digital Agency",
  description:
    "Digital agency: Pembuatan Website, Mobile Apps, SEO Management, Branding, dan Social Media untuk bisnis Anda.",
  keywords: [
    "digital agency",
    "pembuatan website",
    "aplikasi mobile",
    "SEO management",
    "branding",
    "social media",
    "jasa website",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
