import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thermidor Multiposting | Studio & Publishing Engine",
  description: "Plateforme de création, adaptation, planification et multiposting pour artistes et labels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="antialiased selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
