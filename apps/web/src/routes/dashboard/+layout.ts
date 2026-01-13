import { get } from 'svelte/store';
import { auth } from '$lib/stores/auth';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	const state = get(auth);
    console.log(state);
    

	if (!state.isAuthenticated) {
		throw redirect(302, '/login');
	}

	return {};
};
