import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProDance Market — Премиальный маркетплейс для танцоров",
  description:
    "Покупка и продажа тренировочной и турнирной одежды для бальных танцев",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-zinc-50 text-zinc-900 antialiased">{children}</body>
    </html>
  );
}
