import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swanipe | Real-Time RPC Telemetry",
  description:
    "26x faster than public Solana RPCs. Real-time latency benchmarks, WebSocket monitoring, and infrastructure telemetry — powered by RPC Fast.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Swanipe — Real-Time RPC Telemetry",
    description: "26x faster than public Solana RPCs. Live latency benchmarks powered by RPC Fast.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Swanipe | Real-Time RPC Telemetry",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-brand-bg text-white grid-bg`}
      >
        {children}
      </body>
    </html>
  );
}
