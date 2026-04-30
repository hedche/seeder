<script lang="ts">
	import { enhance } from '$app/forms';
	import Tray from '$lib/components/Tray.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let adding = $state(false);
</script>

<header class="bar">
	<h1>🌱 Seeder</h1>
	<button type="button" class="primary" onclick={() => (adding = !adding)}>
		{adding ? 'Cancel' : '+ New tray'}
	</button>
</header>

{#if adding}
	<div class="picker">
		<form method="POST" action="?/addTray" use:enhance>
			<input type="hidden" name="size" value="3x5" />
			<button type="submit" class="size-choice">3 × 5</button>
		</form>
		<form method="POST" action="?/addTray" use:enhance>
			<input type="hidden" name="size" value="4x6" />
			<button type="submit" class="size-choice">4 × 6</button>
		</form>
	</div>
{/if}

{#if data.state.trays.length === 0}
	<p class="empty">No trays yet. Add your first one.</p>
{:else}
	<ul class="grid">
		{#each data.state.trays as tray (tray.id)}
			<li>
				<a class="card" href={`/tray/${tray.id}`} aria-label={`Open tray ${tray.id}`}>
					<div class="card-head">
						<span class="id">#{tray.id}</span>
						<span class="size">{tray.size}</span>
					</div>
					<Tray {tray} compact />
				</a>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 1rem;
		position: sticky;
		top: 0;
		background: var(--bg);
		z-index: 5;
	}
	h1 {
		font-size: 1.4rem;
		margin: 0;
	}
	.primary {
		font-size: 0.95rem;
		padding: 0.7rem 1rem;
		border-radius: 0.6rem;
		border: none;
		background: var(--accent);
		color: white;
		font-weight: 600;
		cursor: pointer;
		min-height: 44px;
	}
	.picker {
		display: flex;
		gap: 0.75rem;
		padding: 0 1rem 1rem;
	}
	.picker form {
		flex: 1;
	}
	.size-choice {
		width: 100%;
		font-size: 1.1rem;
		padding: 1.5rem 1rem;
		border-radius: 0.8rem;
		border: 1px solid var(--border);
		background: var(--surface);
		color: inherit;
		cursor: pointer;
		min-height: 44px;
	}
	.size-choice:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
	.empty {
		padding: 2rem 1rem;
		text-align: center;
		opacity: 0.7;
	}
	.grid {
		list-style: none;
		margin: 0;
		padding: 0 1rem 2rem;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
		gap: 1rem;
	}
	.card {
		display: block;
		padding: 0.75rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 0.8rem;
		text-decoration: none;
		color: inherit;
	}
	.card:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
	.card-head {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin-bottom: 0.5rem;
	}
	.id {
		font-weight: 600;
		font-size: 0.9rem;
	}
	.size {
		font-size: 0.65rem;
		padding: 0.1rem 0.4rem;
		border-radius: 999px;
		background: var(--hover);
		opacity: 0.75;
		letter-spacing: 0.02em;
	}
</style>
