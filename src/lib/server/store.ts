import type { State, Tray, TraySize, Vegetable } from '$lib/types';
import { emptyState, emptyTray } from '$lib/types';

const KEY = 'state';

export async function readState(kv: KVNamespace): Promise<State> {
	const raw = await kv.get(KEY);
	if (!raw) return emptyState();
	try {
		const parsed = JSON.parse(raw) as State;
		if (!parsed.trays || typeof parsed.nextId !== 'number') return emptyState();
		return parsed;
	} catch {
		return emptyState();
	}
}

async function writeState(kv: KVNamespace, state: State): Promise<void> {
	await kv.put(KEY, JSON.stringify(state));
}

export async function addTray(kv: KVNamespace, size: TraySize): Promise<Tray> {
	const state = await readState(kv);
	const tray = emptyTray(state.nextId, size);
	state.trays.push(tray);
	state.nextId += 1;
	await writeState(kv, state);
	return tray;
}

export async function deleteTray(kv: KVNamespace, id: number): Promise<void> {
	const state = await readState(kv);
	state.trays = state.trays.filter((t) => t.id !== id);
	// nextId is intentionally not decremented — physical trays keep their notch count.
	await writeState(kv, state);
}

export async function setPocket(
	kv: KVNamespace,
	trayId: number,
	row: number,
	col: number,
	vegetable: Vegetable | null
): Promise<void> {
	const state = await readState(kv);
	const tray = state.trays.find((t) => t.id === trayId);
	if (!tray) return;
	const pocketRow = tray.pockets[row];
	if (!pocketRow) return;
	const pocket = pocketRow[col];
	if (!pocket) return;
	pocket.vegetable = vegetable;
	pocket.sownAt = vegetable ? new Date().toISOString().slice(0, 10) : null;
	await writeState(kv, state);
}

export async function getTray(kv: KVNamespace, id: number): Promise<Tray | undefined> {
	const state = await readState(kv);
	return state.trays.find((t) => t.id === id);
}
