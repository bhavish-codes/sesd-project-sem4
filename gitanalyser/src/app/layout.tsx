import "./globals.css";
import { Playfair_Display, Space_Mono, Inter } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-mono" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: 'Git Analyser - Marginal Extraction',
  description: 'Analyse Git Profiles effectively',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${spaceMono.variable} ${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
