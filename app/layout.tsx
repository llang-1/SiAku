import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
// import { Link } from "@heroui/link";
import clsx from "clsx";

import { Providers } from "./providers";

// import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Cek Kepribadian | Dukun Modern",
  description: "",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <script src="https://pl28579497.effectivegatecpm.com/6d/0a/fd/6d0afdd93cb4faa1ff1186d5e39f09ae.js"></script>
      <body
        className={clsx(
          "min-h-screen text-foreground bg-gray-900 font-sans antialiased ",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col ">
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
