import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-editorial",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Deeta Fashion | Festive, Ethnic & Ready-to-Wear",
  description: "Handcrafted traditional sarees, festive kurtis, and contemporary wear by Deeta Fashion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased bg-background text-primary selection:bg-primary selection:text-background font-sans">
        <AuthProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
