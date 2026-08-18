import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import QueryProvider from "@/providers/query-provider";
import "./globals.css";
import RequireAuth from "@/features/auth/components/RequireAuth";

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
  title: "Kitzaa Admin | Dashboard",
  description:
    "Centralized administration panel for Kitzaa events, organizer applications, and notifications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${fraunces.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <body>
        <QueryProvider>
          <RequireAuth roles="admin">{children}</RequireAuth>
        </QueryProvider>
      </body>
    </html>
  );
}
