const COOKIE_NAME = 'seeder_auth';
const TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

const encoder = new TextEncoder();

function constantTimeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}

async function hmac(secret: string, message: string): Promise<string> {
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
	return base64UrlEncode(new Uint8Array(sig));
}

function base64UrlEncode(bytes: Uint8Array): string {
	let bin = '';
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function checkPassword(input: string, expected: string): boolean {
	if (!expected) return false;
	return constantTimeEqual(input, expected);
}

export async function makeCookie(secret: string): Promise<string> {
	const expiresAt = Math.floor(Date.now() / 1000) + TTL_SECONDS;
	const payload = String(expiresAt);
	const sig = await hmac(secret, payload);
	return `${payload}.${sig}`;
}

export async function verifyCookie(value: string | undefined, secret: string): Promise<boolean> {
	if (!value) return false;
	const dot = value.indexOf('.');
	if (dot === -1) return false;
	const payload = value.slice(0, dot);
	const sig = value.slice(dot + 1);
	const expected = await hmac(secret, payload);
	if (!constantTimeEqual(sig, expected)) return false;
	const expiresAt = Number(payload);
	if (!Number.isFinite(expiresAt)) return false;
	return Math.floor(Date.now() / 1000) < expiresAt;
}

export const cookieName = COOKIE_NAME;
export const cookieMaxAge = TTL_SECONDS;
