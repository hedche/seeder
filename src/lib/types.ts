export type TraySize = '3x5' | '4x6';

export type Vegetable = {
	name: string;
	emoji: string;
};

export type Pocket = {
	vegetable: Vegetable | null;
	sownAt: string | null; // ISO date YYYY-MM-DD
};

export type Tray = {
	id: number;
	size: TraySize;
	pockets: Pocket[][]; // pockets[row][col]
};

export type State = {
	trays: Tray[];
	nextId: number;
};

export const TRAY_DIMENSIONS: Record<TraySize, { cols: number; rows: number }> = {
	'3x5': { cols: 3, rows: 5 },
	'4x6': { cols: 4, rows: 6 }
};

export function emptyPocket(): Pocket {
	return { vegetable: null, sownAt: null };
}

export function emptyTray(id: number, size: TraySize): Tray {
	const { cols, rows } = TRAY_DIMENSIONS[size];
	const pockets: Pocket[][] = [];
	for (let r = 0; r < rows; r++) {
		const row: Pocket[] = [];
		for (let c = 0; c < cols; c++) row.push(emptyPocket());
		pockets.push(row);
	}
	return { id, size, pockets };
}

export function emptyState(): State {
	return { trays: [], nextId: 1 };
}
