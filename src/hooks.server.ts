import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { cookieName, verifyCookie } from '$lib/server/auth';

const PUBLIC_PATHS = new Set(['/login']);

export const handle: Handle = async ({ event, resolve }) => {
	const env = event.platform?.env;
	const secret = env?.COOKIE_SECRET ?? 'dev-cookie-secret-change-me';
	const cookie = event.cookies.get(cookieName);
	event.locals.authed = await verifyCookie(cookie, secret);

	const path = event.url.pathname;
	const isPublic = PUBLIC_PATHS.has(path);

	if (!event.locals.authed && !isPublic) {
		throw redirect(303, `/login?next=${encodeURIComponent(path + event.url.search)}`);
	}
	if (event.locals.authed && path === '/login') {
		throw redirect(303, '/');
	}

	return resolve(event);
};
