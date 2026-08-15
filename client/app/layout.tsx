import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Kitzaa",
  description: "Veranstaltungs-Entdeckungs- und Organisationsplattform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${fraunces.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
