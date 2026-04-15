import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap" 
});

export const metadata: Metadata = {
  title: "E-Commerce Admin Dashboard",
  description: "Premium admin dashboard for managing products and categories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TooltipProvider>
          {children}
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              style: {
                background: "rgba(15, 23, 42, 0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#f1f5f9",
              },
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
