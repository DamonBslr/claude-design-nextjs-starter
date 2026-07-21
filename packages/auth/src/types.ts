export interface User {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image?: string;
	/** Auth-server system role (`admin` | `user`). */
	role?: string;
	/** Custom app role keys from the auth admin (e.g. `editor`). */
	customRoles?: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface Session {
	session: {
		id: string;
		expiresAt: Date;
		token: string;
		createdAt: Date;
		updatedAt: Date;
		ipAddress?: string;
		userAgent?: string;
		userId: string;
	};
	user: User;
}
