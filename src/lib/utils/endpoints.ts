import type { RequestHandlerOutput } from '@sveltejs/kit';

export const returnError = (
	status: number,
	msg: string,
	ja_msg: string = msg
): RequestHandlerOutput => {
	return {
		status,
		body: {
			message: msg,
			ja_message: ja_msg
		}
	};
};

export const max_bookings = 600;
