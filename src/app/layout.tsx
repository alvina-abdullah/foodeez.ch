import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TopHeader from "@/components/layout/TopHeader";

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
  title: "Foodeez - Food Discovery, Visit, Order & Review Portal",
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
      <body className="min-h-screen flex flex-col font-sans bg-gray-50 text-secondary-900">
        <div className="sticky top-0 z-50">
          <TopHeader />
          <Navbar />
        </div>
        <main className="flex-grow pt-16 md:pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
