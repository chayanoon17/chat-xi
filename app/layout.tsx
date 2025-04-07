import { getServerSession } from "next-auth";
import SessionProvider from "./components/SessionProvider";
import "./globals.css";
import { ThemeProvider } from "../lib/components/ui/theme-provider";
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: "ChatBot-XI",
  description: "AI app",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Analytics/>
          <SessionProvider session={session}>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
