import type { RequestHandler } from '@sveltejs/kit';
import type { UserRow } from '$lib/types/database';

import { createTransport, type Transporter } from 'nodemailer';
import { google } from 'googleapis';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { nanoid } from 'nanoid';

import { returnError } from '$lib/utils/endpoints';
import { validateEmail } from '$lib/utils/auth';
import { admin } from '$lib/utils/supabase-admin';
import { dev } from '$app/env';

const OAuth2 = google.auth.OAuth2;

const email = 'nishi.reservation@gmail.com';

const cliend_id = '612622518249-749o23j2pr1p58u5s5s6mc21rvoca6ua.apps.googleusercontent.com';
const cliend_secret = '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';
const redirect_url = 'https://developers.google.com/oauthplayground';
const refresh_token =
	'1//04MuutifW-RRGCgYIARAAGAQSNwF-L9Irv5wW7SGd_twtMNFivBz3wQ2n2xTxwCY3jCvNEfzLtn5VwdAK3u24g8GIbk3wm12_WR0';

const createTransporter = async (): Promise<Transporter> => {
	// https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a
	const oauth2Client = new OAuth2(cliend_id, cliend_secret, redirect_url);
	oauth2Client.setCredentials({
		refresh_token
	});
	// getAccessToken() doesn't support async/await
	const accessToken = await new Promise((resolve, reject) => {
		oauth2Client.getAccessToken((err, token) => {
			if (err) {
				console.log(err);
				reject('Failed to create access token');
			}
			resolve(token);
		});
	});
	const transporter = createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: email,
			accessToken,
			clientId: cliend_id,
			clientSecret: cliend_secret,
			refreshToken: refresh_token
		},
		from: email
	});
	return transporter;
};

const generateRandomBytes = async (bytes: number): Promise<string> => {
	return await new Promise((resolve, reject) => {
		randomBytes(bytes, (err, buff) => {
			if (err) return reject;
			resolve(buff.toString('hex'));
		});
	});
};

export const post: RequestHandler = async (event) => {
	const { email, name, password } = await event.request.json();
	if (!email || !name || !password) return returnError(400, 'Missing data');
	if (!validateEmail(email)) return returnError(400, 'Invalid email');
	if (password.length < 6) return returnError(400, 'Invalid password');
	const check_user = await admin.from('users').select().eq('email', email).limit(1).maybeSingle();
	if (check_user.error) return returnError(500, check_user.error.message);
	let code: string;
	if (check_user.data) {
		// if a user exist
		const user_data = check_user.data as UserRow;
		if (user_data.verified)
			return returnError(400, 'User already exists', 'ユーザーが既に存在します。');
		code = await generateRandomBytes(64);
		const update_code = await admin
			.from('users')
			.update({
				code
			})
			.eq('uid', user_data.uid);
		if (update_code.error) return returnError(500, update_code.error.message);
	} else {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		const uid = nanoid(16);
		code = await generateRandomBytes(64);
		const create_user = await admin.from('users').insert({
			uid,
			code,
			name,
			email,
			password: hash
		});
		if (create_user.error) return returnError(500, create_user.error.message);
	}
	const transporter = await createTransporter();
	const domain = dev ? 'http://localhost:3000' : 'https://nishi-dance.vercel.app';
	const url = `${domain}/api/auth/verify?code=${code}`;
	await transporter.sendMail({
		from: email,
		to: email,
		subject: '都立西高校ダンス部 - フレッシュマンフェスタ',
		text: `${name}さん、登録ありがとうございます。下のリンクをクリックすると登録が完了します。

${url}

このメールに覚えがない方：
このメールは都立西高校ダンス部の専用予約サイトに登録する際に配信されます。他ユーザーが誤ってメールアドレスを入力し、誤配信された可能性があります。ボタンをクリックされない限りメールアドレスは登録されません。
`
	});
	return {
		status: 200
	};
};
