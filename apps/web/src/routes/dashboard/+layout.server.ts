export const load:LayoutServerLoad = ({ cookies }) => {
	const rt = cookies.get('rt');
	console.log(rt);
	
	if (!rt) {
        console.log('Redirect to login!');
		throw redirect(302, '/login');
	}

	return {};
};