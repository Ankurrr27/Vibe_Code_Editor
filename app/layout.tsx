import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {SessionProvider} from "next-auth/react"
import { auth } from "@/auth";
import { ThemeProvider } from "@/components/providers/theme-provider";
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
  metadataBase: new URL("https://vibe-code-editor-omega.vercel.app"),
  title: {
    default: "Vibe Code Editor | Browser IDE by Ankur Singh",
    template: "%s | Vibe Code Editor",
  },
  description:
    "Vibe Code Editor is a modern browser-based coding platform with project templates, Monaco-powered editing, an online compiler, authentication, and a developer dashboard.",
  keywords: [
    "Vibe Code Editor",
    "Ankur Singh",
    "browser IDE",
    "online code editor",
    "online compiler",
    "Next.js project",
    "Monaco editor",
    "developer dashboard",
    "coding playground",
    "full stack web app",
  ],
  authors: [{ name: "Ankur Singh" }],
  creator: "Ankur Singh",
  publisher: "Ankur Singh",
  applicationName: "Vibe Code Editor",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://vibe-code-editor-omega.vercel.app",
    title: "Vibe Code Editor | Browser IDE by Ankur Singh",
    description:
      "Build, edit, and run code in a polished browser-based workspace with templates, compiler support, and project management tools.",
    siteName: "Vibe Code Editor",
    images: [
      {
        url: "/hero.svg",
        width: 1200,
        height: 630,
        alt: "Vibe Code Editor preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe Code Editor | Browser IDE by Ankur Singh",
    description:
      "A full-stack browser IDE with templates, online compilation, auth, and dashboard workflows.",
    images: ["/hero.svg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.svg",
  },
  category: "technology",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth()

  return (
    <SessionProvider session={session}>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <Toaster/>
              <div className="flex-1">
                {children}

              </div>

            </div>
            {/* {children} */}
          </ThemeProvider>
      </body>
    </html>
    </SessionProvider>
  );
}
