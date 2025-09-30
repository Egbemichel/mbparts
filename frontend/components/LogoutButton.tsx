"use client";
import { logout } from "@/lib/auth";
import { useState } from "react";

export default function LogoutButton() {
    const [loading, setLoading] = useState(false);
    return (
        <button
            onClick={async () => {
                setLoading(true);
                try {
                    await logout();
                    window.location.href = "/admin/login";
                } finally {
                    setLoading(false);
                }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded relative"
            disabled={loading}
        >
            <span className={loading ? "opacity-0" : ""}>Logout</span>
        </button>
    );
}
