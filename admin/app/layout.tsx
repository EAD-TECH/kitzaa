import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import QueryProvider from "@/providers/query-provider";
import "./globals.css";
import RequireAuth from "@/features/auth/components/RequireAuth";
import SideBar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { ThemeProvider } from "@/providers/theme-provider";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <RequireAuth roles="admin">
              <div className="min-h-dvh">
                <SideBar />
                <div className="min-h-dvh pl-28">
                  <Header />

                  {children}
                </div>
              </div>
            </RequireAuth>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
