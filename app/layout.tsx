import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "./lib/AuthContext";
import { StoreProvider } from "./lib/store";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "ProDance Market — Премиальный маркетплейс для танцоров",
  description:
    "Покупка и продажа тренировочной и турнирной одежды для бальных танцев",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-zinc-50 text-zinc-900 antialiased">
        <AuthProvider>
          <StoreProvider>
            <Header />
            {children}
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
