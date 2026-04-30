import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { addTray, readState } from '$lib/server/store';
import type { TraySize } from '$lib/types';

export const load: PageServerLoad = async ({ platform }) => {
	const kv = platform?.env?.SEED_KV;
	if (!kv) throw error(500, 'KV binding SEED_KV is not configured');
	const state = await readState(kv);
	return { state };
};

export const actions: Actions = {
	addTray: async ({ request, platform }) => {
		const kv = platform?.env?.SEED_KV;
		if (!kv) throw error(500, 'KV binding SEED_KV is not configured');
		const data = await request.formData();
		const size = String(data.get('size') ?? '') as TraySize;
		if (size !== '3x5' && size !== '4x6') return fail(400, { error: 'Invalid size' });
		const tray = await addTray(kv, size);
		throw redirect(303, `/tray/${tray.id}`);
	}
};
