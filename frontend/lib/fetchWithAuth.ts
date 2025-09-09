import { getAccessToken, refreshAccessToken } from "./auth";

export async function fetchWithAuth(input: RequestInfo | URL, init: RequestInit = {}) {
    const token = getAccessToken();

    const res = await fetch(input, {
        ...init,
        credentials: "include", // ok to include; refresh uses cookie
        headers: {
            ...(init.headers || {}),
            Authorization: token ? `Bearer ${token}` : "",
        } as HeadersInit,
    });

    if (res.status !== 401) return res;

    // Try to refresh once
    const refreshed = await refreshAccessToken();
    if (!refreshed) return res;

    const retryToken = getAccessToken();
    return fetch(input, {
        ...init,
        credentials: "include",
        headers: {
            ...(init.headers || {}),
            Authorization: retryToken ? `Bearer ${retryToken}` : "",
        } as HeadersInit,
    });
}
