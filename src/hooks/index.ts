import type { User } from '$lib/types/auth';
import { admin } from '$lib/utils/supabase-admin';
import type { GetSession, Handle } from '@sveltejs/kit';

import * as cookie from 'cookie';
import * as jwt from 'jsonwebtoken';

export const handle: Handle = async ({ event, resolve }) => {
	// cookie.parse() param must be a string
	// header.get() may return undefined
	const { token } = cookie.parse(event.request.headers.get('cookie') || '');
	if (token) {
		try {
			const user = jwt.decode(token) as User;
			// check if user has already booked a seat
			const check_user = await admin
				.from('seats')
				.select()
				.eq('uid', user.uid)
				.limit(1)
				.maybeSingle();
			if (check_user.error) throw new Error();
			event.locals['user'] = user;
			event.locals['exists'] = true;
			if (check_user.data) {
				event.locals['booked'] = true;
				event.locals['seat'] = check_user.data.id;
			} else {
				event.locals['booked'] = false;
			}
		} catch {
			event.locals['exists'] = false;
			// handle error when token in invalid
		}
	}
	return await resolve(event);
};

// Will be called when session object is read in load function
export const getSession: GetSession = async (event) => {
	const user = event.locals['user'] as User;
	const booked = event.locals['booked'] as boolean;
	const seat = event.locals['seat'] as string;
	if (!user)
		return {
			exists: false
		};
	if (!booked) {
		return {
			exists: true,
			user,
			booked
		};
	}
	return {
		exists: true,
		user,
		booked,
		seat
	};
};
