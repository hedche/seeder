<script lang="ts">
	import type { Pocket } from '$lib/types';

	let {
		pocket,
		compact = false,
		onclick
	}: {
		pocket: Pocket;
		compact?: boolean;
		onclick?: () => void;
	} = $props();

	const interactive = $derived(typeof onclick === 'function');

	function sowColor(sownAt: string): string {
		const days = (Date.now() - new Date(sownAt).getTime()) / 86_400_000;
		const t = Math.min(Math.max(days, 0) / 14, 1);
		// hue:  0 (red) → 25 (orange) at t=0.5 → 120 (green) at t=1
		const hue = t < 0.5 ? t * 2 * 25 : 25 + (t - 0.5) * 2 * 95;
		// saturation: 45% → 80% → 50%
		const sat = t < 0.5 ? 45 + t * 2 * 35 : 80 - (t - 0.5) * 2 * 30;
		// lightness: 92% → 62% → 50%
		const lit = t < 0.5 ? 92 - t * 2 * 30 : 62 - (t - 0.5) * 2 * 12;
		return `hsl(${hue.toFixed(0)},${sat.toFixed(0)}%,${lit.toFixed(0)}%)`;
	}

	const bgStyle = $derived(
		pocket.vegetable && pocket.sownAt ? `background:${sowColor(pocket.sownAt)}` : ''
	);
</script>

{#if interactive}
	<button
		type="button"
		class="pocket"
		class:compact
		class:filled={pocket.vegetable !== null}
		style={bgStyle}
		title={pocket.vegetable?.name ?? 'Empty pocket'}
		aria-label={pocket.vegetable
			? `${pocket.vegetable.name}, sown ${pocket.sownAt}. Tap to change.`
			: 'Empty pocket. Tap to choose a seed.'}
		onclick={() => onclick?.()}
	>
		{#if pocket.vegetable}
			<span class="emoji">{pocket.vegetable.emoji}</span>
			{#if compact}
				<span class="name">{pocket.vegetable.name}</span>
			{/if}
		{/if}
	</button>
{:else}
	<div
		class="pocket"
		class:compact
		class:filled={pocket.vegetable !== null}
		style={bgStyle}
		title={pocket.vegetable?.name ?? ''}
		aria-label={pocket.vegetable?.name ?? 'empty'}
	>
		{#if pocket.vegetable}
			<span class="emoji">{pocket.vegetable.emoji}</span>
			{#if compact}
				<span class="name">{pocket.vegetable.name}</span>
			{/if}
		{/if}
	</div>
{/if}

<style>
	.pocket {
		--size: 100%;
		width: var(--size);
		aspect-ratio: 1;
		border-radius: 22%;
		background: var(--pocket-empty);
		border: 1px solid var(--pocket-border);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1px;
		padding: 3px;
		cursor: default;
		font-family: inherit;
		color: inherit;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
	}
	button.pocket {
		cursor: pointer;
	}
	button.pocket:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
	.pocket.filled {
		background: var(--pocket-filled);
	}
	.emoji {
		font-size: clamp(0.9rem, 4cqw, 2.5rem);
		line-height: 1;
	}
	.pocket.compact .emoji {
		font-size: 1.4rem;
		line-height: 1;
	}
	.name {
		font-size: 0.72rem;
		line-height: 1.05;
		text-align: center;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		opacity: 0.85;
	}
</style>
