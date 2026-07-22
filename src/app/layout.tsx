import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeeT-X Fashion",
  description: "Premium Garments & E-Commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
