import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";

const meta = {
  title: "SpeedMedia | Event Registration Form",
  description: "SpeedMedia Event Registration Form",
  cardImage: "/speedmedia.jpg",
  robots: "follow, index",
  favicon: "/favicon.ico",
  url: "https://speedmedia-form.vercel.app/",
  webspirrelogo: "/speedmedia.jpg",
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: meta.title,
    description: meta.description,
    referrer: "origin-when-cross-origin",
    keywords: ["Vercel", "Supabase", "Next.js"],
    authors: [{ name: "Vercel", url: "https://vercel.com/" }],
    creator: "Vercel",
    publisher: "Vercel",
    robots: meta.robots,
    icons: { icon: meta.webspirrelogo },
    metadataBase: new URL(meta.url),
    openGraph: {
      url: meta.url,
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage],
      type: "website",
      siteName: meta.title,
    },
    twitter: {
      card: "summary_large_image",
      site: "@Vercel",
      creator: "@Vercel",
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
