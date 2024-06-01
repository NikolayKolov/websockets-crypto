import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "@/components/containers/Header";

// Add Bootstrap CSS styles 
import "bootstrap/dist/css/bootstrap.css";
// Add Bootstrap client side JavaScript functionality
import BootstrapClient from "@/components/common/BootstrapClient";

import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    // default title
    title: "CoinView - view crypto and market data",
    description: "A simple crypto app built on the CoinCap API",
};

import styles from './main.module.scss';

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className + 'min-vw-100 min-vh-100'}>
                <Header />
                <main className={`${styles.main} container-md mx-auto`}>
                    <ThemeProvider storageKey='darkMode' attribute='data-bs-theme'>
                        {children}
                    </ThemeProvider>
                </main>
            </body>
            <BootstrapClient />
            { /* initialize dark mdoe from local storage */ }
        </html>
    );
}
