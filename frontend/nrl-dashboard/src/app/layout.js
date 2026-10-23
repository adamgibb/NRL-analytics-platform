import "./globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

export const metadata = {
  title: "NRL Analytics Platform",
  description: "NRL team performance trends and match statistics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
