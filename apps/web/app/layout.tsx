import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "./ui/components/shared/theme-provider";
import { Button } from '@simplapp/ui';

export const metadata: Metadata = {
  title: "Simplapp",
  description: "This App Bills",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="simplapp-theme"
          disableTransitionOnChange
        >
          <Providers>
            <Button />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}