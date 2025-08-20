import type { Metadata } from "next";
import "./globals.css";
import { ClientThemeProvider } from "@/components/ClientThemeProvider";

export const metadata: Metadata = {
  title: "Intellinum Dashboard",
  description: "Modern premium dashboard application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden">
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}
