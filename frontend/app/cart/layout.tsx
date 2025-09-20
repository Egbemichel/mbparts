// app/parts/layout.tsx
import { ReactNode } from 'react';
import NavbarHome from "@/components/NavbarHome";

export default function PartsLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <NavbarHome />
            <div>{children}</div>
        </>
    );
}
