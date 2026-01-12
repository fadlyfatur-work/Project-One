import { writable } from "svelte/store";
import { apiFetch, setAccessToken } from "$lib/api";
import { PUBLIC_API_URL } from '$env/static/public';

export const auth = writable<{ user: any | null; isAuthenticated: boolean; loading: boolean }>({ user: null, isAuthenticated:false, loading: true });

export async function initAuth(fetchFn: typeof fetch) {
// console.log(PUBLIC_API_URL);

  auth.update(v => ({ ...v, loading: true }));

  const r = await fetchFn(`${PUBLIC_API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
//   console.log(r);
  

  if (r.ok) {
    const json = await r.json();
    setAccessToken(json.data.accessToken);

    const me = await apiFetch("/auth/me");
    if (me.ok) {
      const meJson = await me.json();
      auth.set({ user: meJson.data.user, loading: false });
      return;
    }
  }

  setAccessToken(null);
  auth.set({ user: null, loading: false });
}
