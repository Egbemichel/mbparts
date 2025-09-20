"use client";
import React, { useState } from "react";
import { login } from "@/lib/auth";
import ArrowLeftIcon from "@/public/icons/ArrowLeftIcon";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setU] = useState("");
    const [password, setP] = useState("");
    const [err, setErr] = useState("");
    const router = useRouter();

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            await login(username, password);
            window.location.href = "/admin/parts";
        } catch (e) {
            if (e instanceof Error) {
                setErr(e.message || "Login failed");
            } else {
                setErr("Login failed");
            }
        }
    }

    return (
        <div className="w-full max-w-md mx-auto px-4 py-8 sm:px-8">
            {/* Go Back Button */}
            <button
                className="absolute top-4 left-4 z-20 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition-colors"
                onClick={() => router.push("/")}
                aria-label="Go back"
            >
                <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
            </button>
            <h1 className="text-lg sm:text-2xl font-bold mb-6 text-center">Admin Login</h1>
            {err && <p className="text-red-500 mb-4 text-center">{err}</p>}
            <form onSubmit={onSubmit} className="space-y-6">
                <input className="w-full border rounded-md p-3" placeholder="Username" value={username} onChange={e=>setU(e.target.value)} />
                <input className="w-full border rounded-md p-3" placeholder="Password" type="password" value={password} onChange={e=>setP(e.target.value)} />
                <button className="w-full bg-black text-white p-3 rounded-md text-base font-semibold">Login</button>
            </form>
        </div>
    );
}
