import type { User } from '$lib/types/auth';
import { returnError } from '$lib/utils/endpoints';
import { admin } from '$lib/utils/supabase-admin';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async (event) => {
	const user_exists = event.locals['exists'] as boolean;
	if (!user_exists) return returnError(401, 'Unauthorized user');
	const user = event.locals['user'] as User;
	const cancel_ticket = await admin.from('seats').delete().eq('uid', user.uid);
	if (cancel_ticket.error) returnError(500, cancel_ticket.error.message);
	return {
		status: 200
	};
};
