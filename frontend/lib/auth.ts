const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export function getAccessToken() {
    return localStorage.getItem("token") || "";
}
export function setAccessToken(token: string) {
    localStorage.setItem("token", token);
}
export function clearAccessToken() {
    localStorage.removeItem("token");
}

export async function login(username: string, password: string) {
    const res = await fetch(`${API}/parts/auth/login/`, {
        method: "POST",
        credentials: "include", // ⬅ get refresh cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    const data = await res.json(); // { access }
    setAccessToken(data.access);
    return data;
}

export async function refreshAccessToken(): Promise<boolean> {
    const res = await fetch(`${API}/parts/auth/refresh/`, {
        method: "POST",
        credentials: "include", // ⬅ send refresh cookie
    });
    if (!res.ok) return false;
    const data = await res.json(); // { access }
    if (data?.access) {
        setAccessToken(data.access);
        return true;
    }
    return false;
}

export async function logout() {
    await fetch(`${API}/parts/auth/logout/`, {
        method: "POST",
        credentials: "include",
    });
    clearAccessToken();
}
