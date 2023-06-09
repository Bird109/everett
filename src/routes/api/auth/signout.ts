import type { RequestHandler } from '@sveltejs/kit';

import { dev } from '$app/env';

const secure = dev ? '' : ' Secure;';

export const post: RequestHandler = async () => {
	return {
		status: 200,
		headers: {
			'set-cookie': [`token=; Max-Age=0; Path=/;${secure} HttpOnly`],
			location: '/'
		}
	};
};
