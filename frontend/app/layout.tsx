// app/layout.tsx
import ServerLayout, { metadata } from "./server-layout";
import ClientLayout from "./client-layout";
import "./globals.css";

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ServerLayout>
            <ClientLayout>{children}</ClientLayout>
        </ServerLayout>
    );
}
