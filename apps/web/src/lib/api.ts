import { PUBLIC_API_URL } from '$env/static/public';

let accessToken: string | null = null;

export function setAccessToken(t:string | null) {
    console.log("START Access Token");
    console.log("ac: ",accessToken);
    accessToken = t;
}

export async function apiFetch(path:string, options:RequestInit = {}) {
    const headers = new Headers(options.headers);

    console.log("access Token:", accessToken);
    
    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
        headers.set("Content-Type", "application/json");
    }

    const res = await fetch(`${PUBLIC_API_URL}${path}`,{
        ...options,
        headers,
        credentials: "include",
    });

    console.log(res.status);
    

    if(res.status === 401){
        const r = await fetch(`${PUBLIC_API_URL}/auth/refresh`,{
            method:"POST",
            credentials:"include",
        });

        if(r.ok){
            const json = await r.json();
            setAccessToken(json.data.accessToken);

            const retryHeaders = new Headers(option.headers);
            retryHeaders.set("Content-Type", "application/json");
            retryHeaders.set("Authorization", `Bearer ${json.data.accessToken}`);
            
            return fetch(`${PUBLIC_API_URL}${path}`,{
                ...options,
                headers: retryHeaders,
                credentials: "include",
            });
        }
    }

    return res;
}
