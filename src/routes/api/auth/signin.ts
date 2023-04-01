import type { UserRow } from '$lib/types/database';
import type { RequestHandler } from '@sveltejs/kit';
import type { User } from '$lib/types/auth';

import { returnError } from '$lib/utils/endpoints';
import { admin } from '$lib/utils/supabase-admin';

import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { dev } from '$app/env';
import * as cookie from 'cookie';

const key = 'e5j95K0d-1c80-4Gy2-b59f-bcf9Ac247Ui3';

export const post: RequestHandler = async (event) => {
	const { email, password } = await event.request.json();
	if (!email || !password) return returnError(400, 'Missing data');
	const get_user = await admin
		.from('users')
		.select()
		.match({ verified: true, email })
		.limit(1)
		.maybeSingle();
	if (get_user.error) return returnError(500, get_user.error.message);
	if (!get_user.data)
		return returnError(
			401,
			'User does not exist or incorrect password',
			'ユーザーが存在しない、もしくはパスワードが正しくありません。'
		);
	const user_data = get_user.data as UserRow;
	const authenticated = await bcrypt.compare(password, user_data.password);
	if (!authenticated)
		return returnError(
			401,
			'User does not exist or incorrect password',
			'ユーザーが存在しない、もしくはパスワードが正しくありません。'
		);
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
		status: 200,
		headers: {
			'set-cookie': [token_cookie]
		}
	};
};
