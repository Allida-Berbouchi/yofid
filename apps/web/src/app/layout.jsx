import "./globals.css";

export const metadata = {
    title: "Yovid - Learning Resources",
    description: "Share and discover educational resources",
};
export default function RootLayout({ children }) {
    return (<html lang="en">
      <body>{children}</body>
    </html>);
}
