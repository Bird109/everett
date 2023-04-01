import type { User } from '$lib/types/auth';
import type { AvailableSeats } from '$lib/types/json/seats';
import type { RequestHandler } from '@sveltejs/kit';

import { returnError } from '$lib/utils/endpoints';
import { admin } from '$lib/utils/supabase-admin';

import seats_json from '$lib/json/seats.json';
import { start_time } from '$lib/utils/auth';
const seats = seats_json as AvailableSeats;

export const post: RequestHandler = async (event) => {
	const user_exists = event.locals['exists'] as boolean;
	if (!user_exists) return returnError(401, 'Unauthorized user');
	const user = event.locals['user'] as User;
	const { seat } = await event.request.json();
	if (!seat) return returnError(400, 'Missing data');
	const seat_data: string = seat.split('-');
	if (seat_data.length !== 3) return returnError(400, 'Invalid seat id.');
	const date = seat_data[0];
	const y = seat_data[1];
	const x = Number(seat_data[2]);
	if (!seats[date] || !seats[date][y] || !seats[date][y].includes(x))
		return returnError(400, 'Seat unavailable');
	let remaining_sec = Math.ceil((start_time - new Date().getTime()) / 1000);
	if (remaining_sec > 0) return returnError(403, 'Booking currently unavailable');
	const book_seat = await admin.from('seats').insert({ id: seat, uid: user.uid });
	if (book_seat.error) {
		// a row/seat with same uid already exists
		if (book_seat.error.message.includes('uid_key')) {
			return returnError(500, 'Seat already booked', 'この席は予約済みです。');
		}
		// a row/seat with same seat id already exists
		if (book_seat.error.message.includes('pkey')) {
			return returnError(500, 'User already booked', '予約は1人1席までです。');
		}
		return returnError(500, book_seat.error.message);
	}
	return {
		status: 200
	};
};
