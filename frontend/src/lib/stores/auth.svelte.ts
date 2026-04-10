/**
 * Authentication store using Svelte 5 runes.
 * Manages JWT token and user info with localStorage persistence.
 */

export interface AuthUser {
	readonly id: string;
	readonly name: string;
	readonly email: string;
	readonly role: string;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

function loadFromStorage(): { token: string | null; user: AuthUser | null } {
	if (typeof window === 'undefined') return { token: null, user: null };

	const token = localStorage.getItem(TOKEN_KEY);
	const userRaw = localStorage.getItem(USER_KEY);
	let user: AuthUser | null = null;

	if (userRaw) {
		try {
			user = JSON.parse(userRaw) as AuthUser;
		} catch {
			localStorage.removeItem(USER_KEY);
		}
	}

	return { token, user };
}

function createAuthStore() {
	const initial = loadFromStorage();
	let token = $state<string | null>(initial.token);
	let user = $state<AuthUser | null>(initial.user);

	return {
		get token() {
			return token;
		},
		get user() {
			return user;
		},
		get isAuthenticated() {
			return !!token;
		},

		login(newToken: string, newUser: AuthUser) {
			token = newToken;
			user = newUser;
			localStorage.setItem(TOKEN_KEY, newToken);
			localStorage.setItem(USER_KEY, JSON.stringify(newUser));
		},

		logout() {
			token = null;
			user = null;
			localStorage.removeItem(TOKEN_KEY);
			localStorage.removeItem(USER_KEY);
		}
	};
}

export const auth = createAuthStore();
