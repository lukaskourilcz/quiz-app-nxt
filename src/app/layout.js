import "./globals.css";

export const metadata = {
  title: "JS and React Quiz App.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
