<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Pocket, Vegetable } from '$lib/types';
	import { searchVegetables, type VegetableEntry } from '$lib/vegetables';

	let {
		open,
		trayId,
		row,
		col,
		pocket,
		onclose
	}: {
		open: boolean;
		trayId: number;
		row: number;
		col: number;
		pocket: Pocket | null;
		onclose: () => void;
	} = $props();

	const RECENTS_KEY = 'seeder:recents';
	const MAX_RECENTS = 6;

	function loadRecents(): VegetableEntry[] {
		if (typeof localStorage === 'undefined') return [];
		try {
			return JSON.parse(localStorage.getItem(RECENTS_KEY) ?? '[]');
		} catch {
			return [];
		}
	}

	function saveRecent(v: Vegetable) {
		const recents = loadRecents().filter((r) => r.name !== v.name);
		recents.unshift({ name: v.name, emoji: v.emoji });
		localStorage.setItem(RECENTS_KEY, JSON.stringify(recents.slice(0, MAX_RECENTS)));
	}

	let query = $state('');
	let highlight = $state(0);
	let recents = $state<VegetableEntry[]>([]);

	$effect(() => {
		if (open) {
			query = '';
			highlight = 0;
			recents = loadRecents();
		}
	});

	const results = $derived(
		query.trim()
			? searchVegetables(query)
			: recents.length
				? recents
				: searchVegetables('')
	);
	const trimmed = $derived(query.trim());
	const showCustom = $derived(
		trimmed.length > 0 && !results.some((r) => r.name.toLowerCase() === trimmed.toLowerCase())
	);
	const totalOptions = $derived(results.length + (showCustom ? 1 : 0));

	function pickAt(index: number): Vegetable | null {
		if (index < results.length) {
			const r = results[index];
			return r ? { name: r.name, emoji: r.emoji } : null;
		}
		if (showCustom) return { name: trimmed, emoji: '🌱' };
		return null;
	}

	let pickedName = $state('');
	let pickedEmoji = $state('');
	let formEl: HTMLFormElement | null = $state(null);

	function submitVegetable(v: Vegetable) {
		saveRecent(v);
		pickedName = v.name;
		pickedEmoji = v.emoji;
		queueMicrotask(() => formEl?.requestSubmit());
	}

	function onKey(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			highlight = (highlight + 1) % Math.max(totalOptions, 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			highlight = (highlight - 1 + Math.max(totalOptions, 1)) % Math.max(totalOptions, 1);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const v = pickAt(highlight);
			if (v) submitVegetable(v);
		} else if (e.key === 'Escape') {
			e.preventDefault();
			onclose();
		}
	}

	function pickEntry(entry: VegetableEntry) {
		submitVegetable({ name: entry.name, emoji: entry.emoji });
	}

	function pickCustom() {
		if (!trimmed) return;
		submitVegetable({ name: trimmed, emoji: '🌱' });
	}

	// Keep the backdrop locked to the visual viewport so the sheet stays above the on-screen keyboard.
	let backdropStyle = $state('');

	$effect(() => {
		const vv = typeof window !== 'undefined' ? window.visualViewport : null;
		if (!vv) return;

		function update() {
			backdropStyle = `top: ${vv.offsetTop}px; height: ${vv.height}px;`;
		}

		update();
		vv.addEventListener('resize', update);
		vv.addEventListener('scroll', update);

		return () => {
			vv.removeEventListener('resize', update);
			vv.removeEventListener('scroll', update);
		};
	});
</script>

<svelte:window onkeydown={onKey} />

{#if open}
	<div class="backdrop" role="presentation" onclick={onclose} style={backdropStyle}>
		<div
			class="sheet"
			role="dialog"
			aria-modal="true"
			aria-label="Choose a seed"
			onclick={(e) => e.stopPropagation()}
		>
			<header>
				<h2>
					{pocket?.vegetable ? `Pocket: ${pocket.vegetable.name}` : 'Empty pocket'}
				</h2>
				<button type="button" class="close" onclick={onclose} aria-label="Close">×</button>
			</header>

			<input
				type="text"
				placeholder="Search or type a seed name…"
				bind:value={query}
				autocomplete="off"
				autocapitalize="none"
				autocorrect="off"
				spellcheck="false"
			/>

			<ul class="results" role="listbox">
				{#each results as entry, i}
					<li>
						<button
							type="button"
							class="result"
							class:active={i === highlight}
							onclick={() => pickEntry(entry)}
							onmouseenter={() => (highlight = i)}
						>
							<span class="emoji">{entry.emoji}</span>
							<span class="name">{entry.name}</span>
						</button>
					</li>
				{/each}
				{#if showCustom}
					<li>
						<button
							type="button"
							class="result custom"
							class:active={highlight === results.length}
							onclick={pickCustom}
							onmouseenter={() => (highlight = results.length)}
						>
							<span class="emoji">🌱</span>
							<span class="name">Custom: <em>{trimmed}</em></span>
						</button>
					</li>
				{/if}
			</ul>

			<footer>
				{#if pocket?.vegetable}
					<form
						method="POST"
						action="?/clearPocket"
						use:enhance={() => {
							return async ({ update }) => {
								await update();
								onclose();
							};
						}}
					>
						<input type="hidden" name="trayId" value={trayId} />
						<input type="hidden" name="row" value={row} />
						<input type="hidden" name="col" value={col} />
						<button type="submit" class="clear">Clear pocket</button>
					</form>
				{/if}
			</footer>

			<form
				method="POST"
				action="?/setPocket"
				bind:this={formEl}
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						onclose();
					};
				}}
				style="display:none"
			>
				<input type="hidden" name="trayId" value={trayId} />
				<input type="hidden" name="row" value={row} />
				<input type="hidden" name="col" value={col} />
				<input type="hidden" name="name" value={pickedName} />
				<input type="hidden" name="emoji" value={pickedEmoji} />
			</form>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(3px);
		-webkit-backdrop-filter: blur(3px);
		display: grid;
		place-items: center;
		padding: 1rem;
		z-index: 50;
		animation: fade 0.12s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
	}
	.sheet {
		background: var(--surface);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		max-height: 85dvh;
		overflow: hidden;
		width: min(100%, 28rem);
		border-radius: 14px;
		box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
		animation: rise 0.16s ease-out;
	}
	@keyframes rise {
		from {
			transform: translateY(8px);
			opacity: 0;
		}
	}
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	h2 {
		font-size: 1.05rem;
		margin: 0;
	}
	.close {
		font-size: 1.6rem;
		line-height: 1;
		background: none;
		border: none;
		color: inherit;
		cursor: pointer;
		min-width: 44px;
		min-height: 44px;
	}
	input[type='text'] {
		font-size: 1rem;
		padding: 0.85rem 1rem;
		border-radius: 0.6rem;
		border: 1px solid var(--border);
		background: var(--bg);
		color: inherit;
	}
	input[type='text']:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
	.results {
		list-style: none;
		margin: 0;
		padding: 0;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.result {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.7rem 0.6rem;
		border: none;
		background: transparent;
		border-radius: 0.5rem;
		font-size: 1rem;
		text-align: left;
		color: inherit;
		cursor: pointer;
		min-height: 44px;
	}
	.result.active {
		background: var(--hover);
	}
	.result .emoji {
		font-size: 1.4rem;
	}
	.result.custom .name em {
		font-style: normal;
		font-weight: 600;
	}
	footer {
		display: flex;
		justify-content: flex-end;
	}
	.clear {
		font-size: 0.9rem;
		padding: 0.6rem 0.9rem;
		background: transparent;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		color: var(--danger);
		cursor: pointer;
		min-height: 44px;
	}

	/* Phone: top sheet so the keyboard (which opens from the bottom) never covers it */
	@media (max-width: 600px) {
		.backdrop {
			align-items: start;
			padding: 0;
		}
		.sheet {
			width: 100%;
			border-radius: 0 0 18px 18px;
			padding-top: max(1rem, env(safe-area-inset-top));
			padding-bottom: 1rem;
			max-height: 80%;
		}
	}
</style>
