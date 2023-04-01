import type { Arrangement } from '$lib/types/json/arrangement';
import type { AvailableSeats } from '$lib/types/json/seats';
import type { Chart } from '$lib/types/seats';

export const createChart = (
	arrangement: Arrangement,
	seats: AvailableSeats,
	booked: string[],
	date: number
): Chart => {
	const result: Chart = {};
	const box_y_size = arrangement.box.y;
	const box_x_size = arrangement.box.x;
	let seats_y_index = 0; // for seat id
	for (let box_y_index = 1; box_y_index <= box_y_size; box_y_index++) {
		result[box_y_index] = {};
		let box_y_reference = box_y_index.valueOf();
		// If row is not specified, got to the last sepecifed row
		while (arrangement[box_y_reference] === undefined) {
			box_y_reference -= 1;
		}
		if (Object.values(arrangement[box_y_reference]).includes(1)) {
			seats_y_index += 1;
		}
		let seats_x_index = 0; // for seat id
		for (let box_x_index = 1; box_x_index <= box_x_size; box_x_index++) {
			let box_x_reference = box_x_index.valueOf();
			while (arrangement[box_y_reference][box_x_reference] === undefined) {
				box_x_reference -= 1;
			}
			// if block is empty
			if (arrangement[box_y_reference][box_x_reference] === 0) {
				result[box_y_index][box_x_index] = {
					status: null,
					box: {
						x: box_x_index,
						y: box_y_index
					},
					seat: null
				};
				continue;
			}
			// if block is a seat
			seats_x_index += 1;
			// if seat is non-bookable
			if (!seats[date][seats_y_index] || !seats[date][seats_y_index].includes(seats_x_index)) {
				result[box_y_index][box_x_index] = {
					status: -1,
					box: {
						x: box_x_index,
						y: box_y_index
					},
					seat: {
						x: seats_x_index,
						y: seats_y_index
					}
				};
				continue;
			}
			// if seat is taken
			const seat_id = `${date}-${seats_y_index}-${seats_x_index}`;
			if (booked.includes(seat_id)) {
				result[box_y_index][box_x_index] = {
					status: 1,
					box: {
						x: box_x_index,
						y: box_y_index
					},
					seat: {
						x: seats_x_index,
						y: seats_y_index
					}
				};
				continue;
			}
			// if seat is available
			result[box_y_index][box_x_index] = {
				status: 0,
				box: {
					x: box_x_index,
					y: box_y_index
				},
				seat: {
					x: seats_x_index,
					y: seats_y_index
				}
			};
		}
	}
	return result;
};
