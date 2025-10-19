import ServerLayout from "./server-layout";
import ClientLayout from "./client-layout";
import "./globals.css";

export const metadata = {
    title: "Mercedes Benz Parts | OEM & Accessories | MB Parts Assembly",
    description:
        "Shop genuine Mercedes Benz parts, OEM components, and accessories at MB Parts Assembly. Fast shipping, VIN compatibility checks, and guaranteed quality.",
    metadataBase: new URL("https://mbpartsassembly.com"),
    icons: {
        icon: "/mbparts_logo.ico",          // main favicon
        shortcut: "/mbparts_logo.ico",      // shortcut icon
        apple: "/mbparts_logo.png",         // Apple touch icon
    },
    openGraph: {
        type: "website",
        url: "https://mbpartsassembly.com",
        title: "Mercedes Benz Parts | OEM & Accessories | MB Parts Assembly",
        description:
            "Shop genuine Mercedes Benz parts, OEM components, and accessories at MB Parts Assembly. Fast shipping, VIN compatibility checks, and guaranteed quality.",
        images: [
            {
                url: "https://raw.githubusercontent.com/Egbemichel/images/refs/heads/main/mbparts_logo.png",
                width: 1200,
                height: 630,
                alt: "MB Parts Assembly – Mercedes Benz Parts Store",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Mercedes Benz Parts – MB Parts Assembly",
        description:
            "Explore genuine Mercedes Benz parts, OEM components, and accessories at affordable prices with fast delivery.",
        images: [
            "https://raw.githubusercontent.com/Egbemichel/images/refs/heads/main/mbparts_logo.png",
        ],
    },
    robots: { index: true, follow: true },
    alternates: { canonical: "https://mbpartsassembly.com" },
};

export const viewport = {
    themeColor: "#f54a00"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="antialiased min-h-screen flex flex-col">
        <ServerLayout>
            <ClientLayout>{children}</ClientLayout>
        </ServerLayout>
        </body>
        </html>
    );
}
