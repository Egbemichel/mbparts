"use client";
import React, { useState } from "react";
import { login } from "@/lib/auth";

export default function LoginPage() {
    const [username, setU] = useState("");
    const [password, setP] = useState("");
    const [err, setErr] = useState("");

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
