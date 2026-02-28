import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Hillary Cohort Builder",
  description: "Mock/offline Cohort Builder for HealthTech"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
