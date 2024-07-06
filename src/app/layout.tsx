import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "SpeedMedia ",
  description: "Event Registration Form",
};

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
