import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EvaluationProvider } from "@/context/EvaluationContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Multi-Country Visa Evaluation Tool",
  description: "Evaluate your visa eligibility across multiple countries with AI-powered assessment",
  keywords: ["visa", "immigration", "evaluation", "work permit", "visa assessment"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AdminAuthProvider>
          <EvaluationProvider>
            {children}
            <Toaster position="top-right" richColors />
          </EvaluationProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
