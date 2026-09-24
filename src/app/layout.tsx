import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Stage } from "@/components/stage/Stage";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lumee — Studio web",
    template: "%s — Lumee",
  },
  description: "Lumee conçoit des sites nets, rapides et inoubliables.",
};

// The stage lives in the layout so it persists across routes: navigating
// re-renders it with a new scene instead of remounting, which lets the lines glide.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${manrope.variable} antialiased`}>
      <body>
        <Stage />
        {children}
      </body>
    </html>
  );
}
