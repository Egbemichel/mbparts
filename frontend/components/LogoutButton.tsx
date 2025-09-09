"use client";
import { logout } from "@/lib/auth";

export default function LogoutButton() {
    return (
        <button
            onClick={async () => { await logout(); window.location.href="/admin/login"; }}
            className="bg-red-600 text-white px-4 py-2 rounded"
        >
            Logout
        </button>
    );
}
