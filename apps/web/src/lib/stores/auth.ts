import { writable } from "svelte/store";
import { apiFetch, setAccessToken } from "$lib/api";
import { PUBLIC_API_URL } from '$env/static/public';
import { get } from 'svelte/store';

export const auth = writable<{ user: any | null; isAuthenticated: boolean; loading: boolean }>({ user: null, isAuthenticated:false, loading: true });

export async function initAuth(fetchFn: typeof fetch) {
  console.log('START AUTH');
  
  auth.update(v => ({ ...v, loading: true }));

  const r = await fetchFn(`${PUBLIC_API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  console.log("AUTH 'refresh' TOKEN :", r.ok);

  if (r.ok) {
    console.log('refresh ok!');
    
    const json = await r.json();
    setAccessToken(json.data.accessToken);

    const me = await apiFetch("/auth/check-me");
    console.log('Check-me: ', me);
    
    if (me.ok) {
      const meJson = await me.json();
      auth.set({ user: meJson.data.user, isAuthenticated: true, loading: false });
      const state = get(auth);
      console.log(state);

      return;
    }
  }

  setAccessToken(null);
  auth.set({ user: null, isAuthenticated: false, loading: false });
  console.log('END AUTH');
}
