// app/layout.tsx
import ServerLayout, { metadata } from "./server-layout";
import ClientLayout from "./client-layout";

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ServerLayout>
            <ClientLayout>{children}</ClientLayout>
        </ServerLayout>
    );
}
