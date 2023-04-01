export interface Chart {
	[y: number]: {
		[x: number]: Seat;
	};
}

export interface Seat {
	status: number;
	box: {
		x: number;
		y: number;
	};
	seat: {
		x: number;
		y: number;
	};
}
