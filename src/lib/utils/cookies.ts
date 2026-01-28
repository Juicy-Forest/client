// Client-side cookie utilities
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030';

export function getCookie(name: string): string | null {
	if (typeof document === 'undefined') return null;
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
	return null;
}

export function setCookie(name: string, value: string, days: number = 7): void {
	if (typeof document === 'undefined') return;
	const expires = new Date();
	expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
	document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}`;
}

export function deleteCookie(name: string): void {
	if (typeof document === 'undefined') return;
	document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function getAuthToken(): string | null {
	return getCookie('auth-token');
}

export { API_BASE_URL };
