import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { validateEnv } from '@/lib/utils/env';

// Validasi env tetap di sini
if (process.env.NODE_ENV !== 'production') {
    validateEnv();
}

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "LazisNU Mulyoarjo",
    description: "Platform transparansi pengelolaan koin amal",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id">
            <body
                className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
            >
                {children}
            </body>
        </html>
    );
}