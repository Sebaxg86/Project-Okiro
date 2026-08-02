import type { Metadata, Viewport } from "next";
import { Oxanium, Rajdhani } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const oxanium = Oxanium({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  applicationName: "Okiro",
  title: {
    default: "Okiro — Tu progreso, en equilibrio",
    template: "%s · Okiro",
  },
  description:
    "Convierte tus hábitos de ejercicio, sueño, alimentación, hidratación y enfoque en progreso real.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Okiro",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Okiro",
    title: "Okiro — Tu progreso, en equilibrio",
    description:
      "Convierte hábitos reales en progreso personal sostenible.",
    images: [
      {
        url: "/og-system.png",
        width: 1536,
        height: 1024,
        alt: "Okiro — Tu progreso, en equilibrio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Okiro — Tu progreso, en equilibrio",
    description:
      "Convierte hábitos reales en progreso personal sostenible.",
    images: ["/og-system.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#03030a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      className={`${rajdhani.variable} ${oxanium.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
