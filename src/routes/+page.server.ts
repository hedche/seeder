import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { addTray, deleteTray, readState, setPocket } from '$lib/server/store';
import type { TraySize } from '$lib/types';

export const load: PageServerLoad = async ({ platform }) => {
	const kv = platform?.env?.SEED_KV;
	if (!kv) throw error(500, 'KV binding SEED_KV is not configured');
	const state = await readState(kv);
	return { state };
};

function parseTrayId(raw: FormDataEntryValue | null): number | null {
	const id = Number(raw);
	if (!Number.isInteger(id) || id < 1) return null;
	return id;
}

function parseCoords(data: FormData): { row: number; col: number } | null {
	const row = Number(data.get('row'));
	const col = Number(data.get('col'));
	if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || col < 0) return null;
	return { row, col };
}

export const actions: Actions = {
	addTray: async ({ request, platform }) => {
		const kv = platform?.env?.SEED_KV;
		if (!kv) throw error(500, 'KV binding SEED_KV is not configured');
		const data = await request.formData();
		const size = String(data.get('size') ?? '') as TraySize;
		if (size !== '3x5' && size !== '4x6') return fail(400, { error: 'Invalid size' });
		await addTray(kv, size);
		throw redirect(303, '/');
	},
	setPocket: async ({ request, platform }) => {
		const kv = platform?.env?.SEED_KV;
		if (!kv) throw error(500, 'KV binding SEED_KV is not configured');
		const data = await request.formData();
		const trayId = parseTrayId(data.get('trayId'));
		const coords = parseCoords(data);
		if (trayId === null || !coords) return fail(400, { error: 'Bad input' });
		const name = String(data.get('name') ?? '').trim();
		const emoji = String(data.get('emoji') ?? '🌱');
		if (!name) return fail(400, { error: 'Name required' });
		await setPocket(kv, trayId, coords.row, coords.col, { name, emoji });
		return { ok: true };
	},
	clearPocket: async ({ request, platform }) => {
		const kv = platform?.env?.SEED_KV;
		if (!kv) throw error(500, 'KV binding SEED_KV is not configured');
		const data = await request.formData();
		const trayId = parseTrayId(data.get('trayId'));
		const coords = parseCoords(data);
		if (trayId === null || !coords) return fail(400, { error: 'Bad input' });
		await setPocket(kv, trayId, coords.row, coords.col, null);
		return { ok: true };
	},
	deleteTray: async ({ request, platform }) => {
		const kv = platform?.env?.SEED_KV;
		if (!kv) throw error(500, 'KV binding SEED_KV is not configured');
		const data = await request.formData();
		const trayId = parseTrayId(data.get('trayId'));
		if (trayId === null) return fail(400, { error: 'Bad tray id' });
		await deleteTray(kv, trayId);
		return { ok: true };
	}
};
