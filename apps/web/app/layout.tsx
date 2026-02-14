import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "@simplapp/ui";

export const metadata: Metadata = {
  title: "Simplapp - Factura en segundos",
  description: "Simplapp es una aplicación de facturación rápida y sencilla que te permite crear y gestionar tus facturas en segundos. Con una interfaz intuitiva y herramientas poderosas, simplifica tu proceso de facturación para que puedas centrarte en lo que realmente importa: tu negocio.",
  icons: {
    icon: "/favicon.png",
  },
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
          defaultTheme="light"
          enableSystem={false}
          storageKey="simplapp-theme"
          disableTransitionOnChange
        >
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
