import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Skrut AI - Advanced Resume Analysis & Screening",
    template: "%s | Skrut AI"
  },
  description: "Skrut AI uses advanced multi-agent systems to provide unbiased, efficient, and deep resume screening for modern recruitment teams.",
  keywords: ["Resume Analysis", "AI Screening", "Recruitment Automation", "Candidate Evaluation", "HR Tech", "AI Recruiter"],
  authors: [{ name: "Skrut AI Team" }],
  creator: "Skrut AI",
  metadataBase: new URL('https://skrut.vercel.app'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://skrut.vercel.app",
    siteName: "Skrut AI",
    title: "Skrut AI - Smart Candidate Evaluation",
    description: "Multi-agent AI system for fair and faster resume screening.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Skrut AI Analysis Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skrut AI - Agentic Resume Analysis",
    description: "Scale your recruitment with AI that thinks like a team.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
