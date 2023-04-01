export interface User {
	uid: string;
	name: string;
	email: string;
}

export interface Session extends Partial<User> {
	exists: boolean;
	booked?: boolean;
	seat?: string;
}
