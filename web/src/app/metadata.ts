import { Metadata } from "next";

export const metadata: Metadata = {
  title: "InTrades - Learn Skilled Trades Through Gamified Challenges",
  description: "Master skilled trades through interactive challenges, earn XP, unlock badges, and level up your career. Learn electrical, plumbing, carpentry, HVAC, and welding skills.",
  keywords: ["skilled trades", "vocational training", "electrical", "plumbing", "carpentry", "HVAC", "welding", "education", "gamification"],
  authors: [{ name: "InTrades Team" }],
  creator: "InTrades",
  publisher: "InTrades",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "InTrades",
    title: "InTrades - Learn Skilled Trades Through Gamified Challenges",
    description: "Master skilled trades through interactive challenges, earn XP, unlock badges, and level up your career.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "InTrades Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InTrades - Learn Skilled Trades",
    description: "Master skilled trades through interactive challenges, earn XP, unlock badges, and level up your career.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
};
