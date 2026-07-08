import type { Metadata } from "next";
import { Hanken_Grotesk, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mehr — The part of you they remember",
  description: "Fragrance composed in the cool light of morning — refined, lasting, unmistakably yours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${hanken.variable} ${schibsted.variable}`}>
      <body>
        <Header />
        <MobileMenu />
        {children}
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
