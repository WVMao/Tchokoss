import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { ToastProvider } from "@/components/ui/toast";
import { CartDrawer } from "@/components/cart-drawer";

export const metadata: Metadata = {
  title: "TCHOKOSS | C'est difficile mais c'est possible",
  description: "Boutique en ligne premium - Mode, Maison & Accessoires",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <ToastProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
