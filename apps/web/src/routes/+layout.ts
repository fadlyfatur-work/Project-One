// src/routes/+layout.ts
import { initAuth } from '$lib/stores/auth';

export const load = async ({fetch}) => {
	await initAuth(fetch);
	return {};
};
