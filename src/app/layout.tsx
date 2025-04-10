import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TopHeader from "@/components/layout/TopHeader";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Foodeez - Food Discovery, Visit & Review Portal",
  description: "Discover, visit, and review your favorite restaurants and food with Foodeez - the ultimate food discovery platform.",
  keywords: "food, restaurants, discovery, reviews, dining, cuisine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col font-sans bg-background text-text-main">
        <AnnouncementBar />
        <TopHeader />
        <Navbar />
        {/* Content padding to avoid overlap */}
        <main className="">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
