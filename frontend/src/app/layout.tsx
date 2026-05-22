import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import ChatWidget from "@/components/ui/ChatWidget";

export const metadata = {
  title: "VESTIGE | The Art of Living",
  description: "Objects and garments selected with an editorial eye for craft, material, and permanence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster position="top-center" expand={true} richColors />
        <ChatWidget />
      </body>
    </html>
  );
}
