export const formatTime = (time: number): string => {
	const seconds = Math.floor(time % 60);
	const minutes = Math.floor((time / 60) % 60);
	const hours = Math.floor((time / (60 * 60)) % 24);
	const days = Math.floor(time / (60 * 60 * 24));
	return `${time < 0 ? '-' : ''}${toNDigit(days, 2)}:${toNDigit(hours, 2)}:${toNDigit(
		minutes,
		2
	)}:${toNDigit(seconds, 2)}`;
};

export const toNDigit = (num: number, n: number): string => {
	return `${'0'.repeat(n - num.toString().length)}${num}`;
};

export const month_table = {
	1: 'Jan.',
	2: 'Feb.',
	3: 'Mar.',
	4: 'Apr.',
	5: 'May',
	6: 'Jun.',
	7: 'Jul',
	8: 'Aug.',
	9: 'Sep.',
	10: 'Oct.',
	11: 'Nov.',
	12: 'Dec.'
};

export const num_to_Alphabet = (num: number): string => {
	return String.fromCharCode(64 + num);
};
