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

	function sowStyle(sownAt: string): string {
		const days = (Date.now() - new Date(sownAt).getTime()) / 86_400_000;
		const t = Math.min(Math.max(days, 0) / 21, 1);
		// white (day 0) → pale green → dark green (day 21)
		const sat = t * 55;
		const lit = 100 - t * 65;
		const color = lit > 60 ? '#000' : '#fff';
		return `background:hsl(120,${sat.toFixed(0)}%,${lit.toFixed(0)}%);color:${color}`;
	}

	const bgStyle = $derived(
		pocket.vegetable && pocket.sownAt ? sowStyle(pocket.sownAt) : ''
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
