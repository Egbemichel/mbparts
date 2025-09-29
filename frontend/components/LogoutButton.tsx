"use client";
import { logout } from "@/lib/auth";
import { useLoading } from "@/components/LoadingContext";

export default function LogoutButton() {
    const { loading, startLoading, stopLoading } = useLoading();
    return (
        <button
            onClick={async () => {
                startLoading();
                try {
                    await logout();
                    window.location.href = "/admin/login";
                } finally {
                    stopLoading();
                }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded relative"
            disabled={loading}
        >
            <span className={loading ? "opacity-0" : ""}>Logout</span>
        </button>
    );
}
