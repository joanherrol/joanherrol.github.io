import type { Metadata } from "next";
import { Press_Start_2P, Tiny5 } from "next/font/google";
import "./globals.css";
import { paletteBootScript } from "@/lib/palette";
import { pixelBootScript } from "@/lib/pixel";

const display = Press_Start_2P({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const body = Tiny5({
  variable: "--font-body",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Joan Hervás · Frontend developer",
  description: "Portfolio of Joan Hervás, frontend developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: paletteBootScript }} />
        <script dangerouslySetInnerHTML={{ __html: pixelBootScript }} />
        {children}
      </body>
    </html>
  );
}
