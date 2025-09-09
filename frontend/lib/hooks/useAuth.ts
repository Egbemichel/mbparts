"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, refreshAccessToken } from "@/lib/auth";

export function useAuth() {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthed] = useState(false);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            let token = getAccessToken();
            if (!token) {
                // try silent refresh from cookie
                const ok = await refreshAccessToken();
                token = getAccessToken();
                if (!ok || !token) {
                    setAuthed(false);
                    setLoading(false);
                    router.push("/admin/login");
                    return;
                }
            }
            setAuthed(true);
            setLoading(false);
        })();
    }, [router]);

    return { loading, authenticated };
}
