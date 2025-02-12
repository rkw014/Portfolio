import type { Metadata } from "next";
import "./globals.css";
import AuthWrapper from "../components/AuthWrapper";
import Header from "./header";
import Footer from "./footer";
import '@fortawesome/fontawesome-svg-core/styles.css'



export const metadata: Metadata = {
  title: "Ruikun's Website",
  description: "A website to show myself",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthWrapper>
        <body
          className={`flex flex-col min-h-screen bg-gray-50 text-gray-900`}
        >
          <Header />
          
          <main className="flex-grow mx-auto w-full max-w-5xl px-4 py-6">
            {children}
          </main>

          <Footer />
        </body>
      </AuthWrapper>
    </html>
  );
}
