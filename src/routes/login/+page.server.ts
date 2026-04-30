import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { checkPassword, cookieMaxAge, cookieName, makeCookie } from '$lib/server/auth';

export const actions: Actions = {
	default: async ({ request, cookies, platform, url }) => {
		const env = platform?.env;
		const expected = env?.APP_PASSWORD ?? 'dev-password';
		const cookieSecret = env?.COOKIE_SECRET ?? 'dev-cookie-secret-change-me';

		const data = await request.formData();
		const password = String(data.get('password') ?? '');

		if (!checkPassword(password, expected)) {
			return fail(401, { error: 'Wrong password' });
		}

		const value = await makeCookie(cookieSecret);
		cookies.set(cookieName, value, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: url.protocol === 'https:',
			maxAge: cookieMaxAge
		});

		const next = url.searchParams.get('next');
		throw redirect(303, next && next.startsWith('/') ? next : '/');
	}
};
