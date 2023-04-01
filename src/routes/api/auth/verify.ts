import type { UserRow } from '$lib/types/database';
import type { RequestHandler } from '@sveltejs/kit';
import type { User } from '$lib/types/auth';

import { returnError } from '$lib/utils/endpoints';
import { admin } from '$lib/utils/supabase-admin';

import * as cookie from 'cookie';
import * as jwt from 'jsonwebtoken';
import { dev } from '$app/env';

const key = 'e5j95K0d-1c80-4Gy2-b59f-bcf9Ac247Ui3';

export const get: RequestHandler = async (event) => {
	const code = event.url.searchParams.get('code');
	if (!code || code.length !== 128) return returnError(400, 'Invalid code');
	const check_user = await admin
		.from('users')
		.select()
		.match({ code, verified: false })
		.limit(1)
		.maybeSingle();
	if (check_user.error) return returnError(500, check_user.error.message);
	if (!check_user.data) return returnError(400, 'Invalid code');
	const user_data = check_user.data as UserRow;
	const verify_user = await admin
		.from('users')
		.update({
			verified: true
		})
		.eq('uid', user_data.uid);
	if (verify_user.error) return returnError(500, verify_user.error.message);
	const user: User = {
		uid: user_data.uid,
		email: user_data.email,
		name: user_data.name
	};
	const token = jwt.sign(user, key, { expiresIn: 60 * 60 * 24 * 30 });
	const token_cookie = cookie.serialize('token', token, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		maxAge: 60 * 60 * 24 * 30
	});
	return {
		status: 302,
		headers: {
			'set-cookie': [token_cookie],
			location: '/'
		}
	};
};
