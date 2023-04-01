import { returnError } from '$lib/utils/endpoints';
import { admin } from '$lib/utils/supabase-admin';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (event) => {
	const id = event.url.searchParams.get('id');
	if (!id) return returnError(400, 'Missing data');
	const user_exists = event.locals['exists'] as boolean;
	if (!user_exists) return returnError(401, 'Unauthorized user');
	const get_seats = await admin.from('seats').select('id').ilike('id', `${id}-%`);
	if (get_seats.error) return returnError(500, get_seats.error.message);
	return {
		status: 200,
		body: JSON.stringify({ data: get_seats.data.map((val) => val.id) })
	};
};
