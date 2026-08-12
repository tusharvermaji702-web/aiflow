import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIFlow",
  description: "Discover AI tools and turn goals into executable AI workflows.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
