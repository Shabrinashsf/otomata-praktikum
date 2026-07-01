import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";

export const metadata: Metadata = {
  title: {
    template: "%s | OtomataLab",
    default: "OtomataLab — Praktikum Teori Otomata",
  },
  description:
    "Aplikasi praktikum Teori Otomata: Lexical Analyzer (Praktikum 1) dan FSM String Checker (Praktikum 2).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {/* Animated background */}
        <div className="bg-orbs" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <div className="page-wrapper">
          <Navbar />
          <main style={{ flex: 1 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
