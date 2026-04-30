import type { Vegetable } from './types';

export type VegetableEntry = Vegetable & { aliases?: string[] };

const FALLBACK = '🌱';

// Common UK garden vegetables and herbs. Where Unicode has no good match the
// emoji falls back to a generic seedling and the name carries the meaning.
export const VEGETABLES: VegetableEntry[] = [
	{ name: 'Tomato', emoji: '🍅' },
	{ name: 'Carrot', emoji: '🥕' },
	{ name: 'Lettuce', emoji: '🥬' },
	{ name: 'Cabbage', emoji: '🥬' },
	{ name: 'Kale', emoji: FALLBACK },
	{ name: 'Spinach', emoji: '🥬' },
	{ name: 'Rocket', emoji: FALLBACK, aliases: ['arugula'] },
	{ name: 'Chard', emoji: FALLBACK, aliases: ['swiss chard'] },
	{ name: 'Pak choi', emoji: '🥬', aliases: ['bok choy'] },
	{ name: 'Broccoli', emoji: '🥦' },
	{ name: 'Cauliflower', emoji: FALLBACK },
	{ name: 'Brussels sprout', emoji: FALLBACK },
	{ name: 'Onion', emoji: '🧅' },
	{ name: 'Spring onion', emoji: '🧅', aliases: ['scallion', 'green onion'] },
	{ name: 'Garlic', emoji: '🧄' },
	{ name: 'Leek', emoji: FALLBACK },
	{ name: 'Shallot', emoji: '🧅' },
	{ name: 'Pepper', emoji: '🫑', aliases: ['bell pepper', 'capsicum'] },
	{ name: 'Chilli', emoji: '🌶️', aliases: ['chili', 'chile'] },
	{ name: 'Cucumber', emoji: '🥒' },
	{ name: 'Courgette', emoji: '🥒', aliases: ['zucchini'] },
	{ name: 'Pumpkin', emoji: '🎃' },
	{ name: 'Squash', emoji: FALLBACK, aliases: ['butternut'] },
	{ name: 'Aubergine', emoji: '🍆', aliases: ['eggplant'] },
	{ name: 'Pea', emoji: FALLBACK, aliases: ['garden pea'] },
	{ name: 'Mangetout', emoji: FALLBACK, aliases: ['snow pea', 'sugar snap'] },
	{ name: 'Broad bean', emoji: FALLBACK, aliases: ['fava bean'] },
	{ name: 'Runner bean', emoji: FALLBACK },
	{ name: 'French bean', emoji: FALLBACK, aliases: ['green bean'] },
	{ name: 'Beetroot', emoji: FALLBACK, aliases: ['beet'] },
	{ name: 'Radish', emoji: FALLBACK },
	{ name: 'Turnip', emoji: FALLBACK },
	{ name: 'Parsnip', emoji: FALLBACK },
	{ name: 'Potato', emoji: '🥔' },
	{ name: 'Sweet potato', emoji: '🍠' },
	{ name: 'Sweetcorn', emoji: '🌽', aliases: ['corn', 'maize'] },
	{ name: 'Celery', emoji: FALLBACK },
	{ name: 'Celeriac', emoji: FALLBACK },
	{ name: 'Fennel', emoji: FALLBACK },
	{ name: 'Asparagus', emoji: FALLBACK },
	{ name: 'Artichoke', emoji: FALLBACK },
	{ name: 'Strawberry', emoji: '🍓' },
	{ name: 'Basil', emoji: '🌿' },
	{ name: 'Parsley', emoji: '🌿' },
	{ name: 'Coriander', emoji: '🌿', aliases: ['cilantro'] },
	{ name: 'Mint', emoji: '🌿' },
	{ name: 'Dill', emoji: '🌿' },
	{ name: 'Thyme', emoji: '🌿' },
	{ name: 'Sage', emoji: '🌿' },
	{ name: 'Rosemary', emoji: '🌿' },
	{ name: 'Oregano', emoji: '🌿' },
	{ name: 'Chives', emoji: '🌿' },
	{ name: 'Tarragon', emoji: '🌿' }
];

export function searchVegetables(query: string, limit = 8): VegetableEntry[] {
	const q = query.trim().toLowerCase();
	if (!q) return VEGETABLES.slice(0, limit);
	const starts: VegetableEntry[] = [];
	const contains: VegetableEntry[] = [];
	for (const v of VEGETABLES) {
		const haystack = [v.name.toLowerCase(), ...(v.aliases ?? []).map((a) => a.toLowerCase())];
		if (haystack.some((h) => h.startsWith(q))) starts.push(v);
		else if (haystack.some((h) => h.includes(q))) contains.push(v);
	}
	return [...starts, ...contains].slice(0, limit);
}

export function customVegetable(name: string): Vegetable {
	return { name: name.trim(), emoji: FALLBACK };
}
