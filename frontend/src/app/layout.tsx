import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK"],
});

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SathiCare — your body, your pace",
  description:
    "A private companion for your period, pregnancy and wellbeing. Ask Saathi anything, find care near you, reach help fast.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-paper text-ink`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
