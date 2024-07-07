import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";

const meta = {
  title: "SpeedMedia | program / Training Registration Form",
  description: "SpeedMedia Program / Training Registration Form",
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
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
          integrity="sha512-d08qW7B8z5cz5jwFFosWyFXdHZb68Q7NCT6ksDgBF4qi5scdb/B0j4IbftN4D0l3SKeICXKEb7KjD0e5fgME2A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <Toaster />
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
