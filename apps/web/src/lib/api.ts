let accessToken: string | null = null;

export function setAccessToken(t:string | null) {
    accessToken = t;
}

export async function apiFetch(path:string, option: requestInit = {}) {
    const headers = new Headers(options.headers);

    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
        headers.set("Content-Type", "application/json");
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`,{
        ...option,
        headers,
        credentials: "include",
    });

    if(res.status === 401){
        const r = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`,{
            method:"POST",
            credentials:"include",
        });

        if(r.ok){
            const json = await r.json();
            setAccessToken(json.data.accessToken);

            const retryHeaders = new Headers(option.headers);
            retryHeaders.set("Content-Type", "application/json");
            retryHeaders.set("Authorization", `Bearer ${json.data.accessToken}`);
            
            return fetch(`${import.meta.env.VITE_API_URL}${path}`,{
                ...option,
                headers: retryHeaders,
                credentials: "include",
            });
        }
    }

    return res;
}
