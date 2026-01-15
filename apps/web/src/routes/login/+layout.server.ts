import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load:LayoutServerLoad = ({ cookies }) => {
	const rt = cookies.get('rt');
	
	if (rt) {
		throw redirect(302, '/dashboard');
	}

	return {};
};