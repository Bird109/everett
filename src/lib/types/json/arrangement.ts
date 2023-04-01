export interface Arrangement {
	box: {
		x: number;
		y: number;
	};
	[y: string]: {
		[x: string]: number;
	};
}
