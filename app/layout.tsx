import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GDG on Campus ITU",
  description:
    "GDG on Campus ITU is a community of developers, designers, and students who are passionate about technology and innovation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#000",
              color: "#fff",
              fontSize: "14px",
              borderRadius: "10px",
              padding: "10px",
              border: "1px solid #333",
              boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)",
            },
          }}
        />
      </body>
    </html>
  );
}
