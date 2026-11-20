import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Nav from "@/components/layout/Nav";

const font = Bricolage_Grotesque({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mon frigo",
  description: "Gérer le frigo et préparer la liste de courses",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={font.className}>
        <Nav />
        <main className="page">{children}</main>
      </body>
    </html>
  );
}
