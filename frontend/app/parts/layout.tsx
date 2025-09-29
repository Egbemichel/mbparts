// app/parts/layout.tsx
import NavbarHome from "@/components/NavbarHome";
import { ReactNode } from 'react';

export default function PartsLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <NavbarHome />
            <div>{children}</div>
        </>
    );
}
