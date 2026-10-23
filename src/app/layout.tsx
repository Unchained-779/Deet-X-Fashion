import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import AuthProvider from "@/components/AuthProvider";
import GlobalFooter from "@/components/GlobalFooter";
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
  title: "Deeta Fashion | Authentic Indian Handcrafted Ethnic & Couture",
  description: "Pure Kanjeevaram and Banarasi silk sarees, designer suits, and festive ensembles handcrafted with pride by Deeta Fashion (Rakhi Chandra).",
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
      <body className="antialiased bg-background text-primary selection:bg-primary selection:text-background font-sans min-h-screen flex flex-col">
        <AuthProvider>
          <SmoothScrollProvider>
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <GlobalFooter />
          </SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
