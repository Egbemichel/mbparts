// app/server-layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "MB Parts Assembly – Quality Auto Parts for Mercedes-Benz",
    description:
        "Find high-quality, genuine, and affordable auto parts for Mercedes-Benz vehicles. Shop engine parts, body parts, and accessories with fast delivery and warranty included.",
    metadataBase: new URL("https://mbpartsassembly.com"),
    icons: {
        icon: "/mbparts_logo.ico",          // main favicon
        shortcut: "/mbparts_logo.ico",      // shortcut icon
        apple: "/mbparts_logo.png",   // optional for Apple devices
    },
    openGraph: {
        type: "website",
        url: "https://mbpartsassembly.com",
        title: "MB Parts Assembly – Quality Auto Parts for Mercedes-Benz",
        description:
            "Shop trusted Mercedes-Benz parts with warranty and quick delivery. MB Parts Assembly is your reliable source for premium car parts online.",
        images: [
            {
                url: "https://raw.githubusercontent.com/Egbemichel/images/refs/heads/main/mbparts_logo.png",
                width: 1200,
                height: 630,
                alt: "MB Parts Assembly – Mercedes-Benz Parts Store",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "MB Parts Assembly – Quality Auto Parts for Mercedes-Benz",
        description:
            "Explore genuine Mercedes-Benz auto parts and accessories at affordable prices with fast delivery.",
        images: ["https://raw.githubusercontent.com/Egbemichel/images/refs/heads/main/mbparts_logo.png"],
    },
    themeColor: "#f54a00",
    robots: { index: true, follow: true },
    alternates: { canonical: "https://mbpartsassembly.com", },
};

export default function ServerLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
