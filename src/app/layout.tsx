import type { Metadata } from "next";
import {  Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themeprovider";


const inter = Inter({ subsets: ["latin"]})

export const metadata: Metadata = {
  title: "Portofolio",
  description: "Ayo Berkolaborasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={inter.className}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          
            <div>{children}</div>
          
          
        </ThemeProvider>
      </body>
    </html>
  );
}
