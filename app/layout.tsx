import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "AUSVIA",
  description: "Personalised recommendations you can trust.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap"
          rel="stylesheet"
        />
        {/* Mobile browser UI / status bar colors (Chrome/Android, Safari, etc.) */}
        <meta name="theme-color" content="#000000" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        {/* iOS Safari status bar style */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/* \"black-translucent\" gives a black bar that overlays page content on iOS */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] flex flex-col font-sans">
        {/* Top black strip + header — sticky together */}
        <div className="sticky top-0 z-50">
          <div className="w-full bg-black text-[11px] text-[#F5F5F0]">
            <div className="max-w-[1400px] mx-auto px-4 py-2 overflow-hidden whitespace-nowrap">
              <div className="inline-block animate-[tick_8s_linear_infinite]">
                <span className="mr-8 tracking-[0.18em] uppercase">We ship worldwide</span>
                <span className="mr-8 tracking-[0.18em] uppercase">We ship worldwide</span>
                <span className="mr-8 tracking-[0.18em] uppercase">We ship worldwide</span>
              </div>
            </div>
          </div>
          <Header />
        </div>
        <main className="flex-1 bg-[#F5F5F7] text-black">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
