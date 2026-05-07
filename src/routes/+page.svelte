<script lang="ts">
	import { enhance } from '$app/forms';
	import Tray from '$lib/components/Tray.svelte';
	import PocketModal from '$lib/components/PocketModal.svelte';
	import type { Pocket, Tray as TrayType } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let adding = $state(false);

	let editingTrayId = $state<number | null>(null);
	let editValue = $state(0);
	let renameError = $state<string | null>(null);

	function startEdit(tray: TrayType) {
		editingTrayId = tray.id;
		editValue = tray.id;
		renameError = null;
	}
	function cancelEdit() {
		editingTrayId = null;
		renameError = null;
	}
	function autoFocus(node: HTMLElement) {
		(node as HTMLInputElement).focus();
		(node as HTMLInputElement).select?.();
	}

	let activeTrayId = $state<number | null>(null);
	let activeRow = $state(-1);
	let activeCol = $state(-1);

	const open = $derived(activeTrayId !== null && activeRow >= 0 && activeCol >= 0);
	const activeTray = $derived<TrayType | undefined>(
		activeTrayId === null ? undefined : data.state.trays.find((t) => t.id === activeTrayId)
	);
	const activePocket = $derived<Pocket | null>(
		activeTray?.pockets[activeRow]?.[activeCol] ?? null
	);

	function openPocket(trayId: number, row: number, col: number) {
		activeTrayId = trayId;
		activeRow = row;
		activeCol = col;
	}
	function closeModal() {
		activeTrayId = null;
		activeRow = -1;
		activeCol = -1;
	}
</script>

<header class="bar">
	<h1>🌱 Seeder</h1>
	<button
		type="button"
		class="primary"
		onclick={() => {
			adding = !adding;
			if (adding) window.scrollTo({ top: 0, behavior: 'smooth' });
		}}
	>
		{adding ? 'Cancel' : '+ New tray'}
	</button>
</header>

{#if adding}
	<div class="picker">
		<form
			method="POST"
			action="?/addTray"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					adding = false;
				};
			}}
		>
			<input type="hidden" name="size" value="3x5" />
			<button type="submit" class="size-choice">3 × 5</button>
		</form>
		<form
			method="POST"
			action="?/addTray"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					adding = false;
				};
			}}
		>
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
			<li class="card">
				<div class="card-head">
					{#if editingTrayId === tray.id}
						<form
							class="id-form"
							method="POST"
							action="?/renameTray"
							use:enhance={() => {
								return async ({ result, update }) => {
									if (result.type === 'failure') {
										renameError =
											(result.data as { error?: string })?.error ?? 'Error';
									} else {
										editingTrayId = null;
										renameError = null;
										await update();
									}
								};
							}}
						>
							<input type="hidden" name="trayId" value={tray.id} />
							<span class="id-hash">#</span>
							<input
								class="id-input"
								type="number"
								name="newId"
								bind:value={editValue}
								min="1"
								step="1"
								use:autoFocus
								onkeydown={(e) => {
									if (e.key === 'Escape') cancelEdit();
								}}
							/>
							<button type="submit" class="id-btn" aria-label="Confirm rename">✓</button>
							<button
								type="button"
								class="id-btn"
								aria-label="Cancel rename"
								onclick={cancelEdit}>✕</button
							>
						</form>
					{:else}
						<button class="id" onclick={() => startEdit(tray)} title="Rename tray"
							>#{tray.id}</button
						>
					{/if}
					{#if renameError && editingTrayId === tray.id}
						<span class="rename-error">{renameError}</span>
					{/if}
					<span class="size">{tray.size}</span>
					<form
						class="delete-form"
						method="POST"
						action="?/deleteTray"
						use:enhance
						onsubmit={(e) => {
							if (!confirm(`Delete tray #${tray.id}? This can't be undone.`))
								e.preventDefault();
						}}
					>
						<input type="hidden" name="trayId" value={tray.id} />
						<button type="submit" class="delete" aria-label={`Delete tray ${tray.id}`}>🗑</button>
					</form>
				</div>
				<Tray {tray} compact onPocketClick={(r, c) => openPocket(tray.id, r, c)} />
			</li>
		{/each}
	</ul>
{/if}

<PocketModal
	{open}
	trayId={activeTrayId ?? 0}
	row={activeRow}
	col={activeCol}
	pocket={activePocket}
	onclose={closeModal}
/>

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
		font-size: 0.8rem;
		padding: 0.4rem 0.7rem;
		border-radius: 0.5rem;
		border: none;
		background: var(--accent);
		color: white;
		font-weight: 600;
		cursor: pointer;
		min-height: 32px;
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
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
		gap: 1rem;
	}
	.card {
		display: flex;
		flex-direction: column;
		padding: 0.75rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 0.8rem;
		color: inherit;
	}
	.card-head {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin-bottom: 0.5rem;
	}
	.delete-form {
		margin-left: auto;
	}
	.id {
		font-weight: 600;
		font-size: 0.9rem;
		background: none;
		border: none;
		color: inherit;
		padding: 0;
		cursor: pointer;
		border-radius: 0.25rem;
	}
	.id:hover,
	.id:focus-visible {
		text-decoration: underline;
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
	.id-form {
		display: flex;
		align-items: center;
		gap: 0.2rem;
	}
	.id-hash {
		font-weight: 600;
		font-size: 0.9rem;
	}
	.id-input {
		width: 3.5rem;
		font-size: 0.9rem;
		font-weight: 600;
		font-family: inherit;
		padding: 0.1rem 0.3rem;
		border: 1px solid var(--accent);
		border-radius: 0.3rem;
		background: var(--bg);
		color: inherit;
	}
	.id-input:focus {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}
	.id-btn {
		background: none;
		border: none;
		color: inherit;
		font-size: 0.8rem;
		cursor: pointer;
		padding: 0.2rem 0.3rem;
		border-radius: 0.3rem;
		opacity: 0.6;
		line-height: 1;
	}
	.id-btn:hover,
	.id-btn:focus-visible {
		opacity: 1;
		background: var(--hover);
	}
	.rename-error {
		font-size: 0.7rem;
		color: #e53e3e;
		white-space: nowrap;
	}
	.size {
		font-size: 0.65rem;
		padding: 0.1rem 0.4rem;
		border-radius: 999px;
		background: var(--hover);
		opacity: 0.75;
		letter-spacing: 0.02em;
	}
	.delete {
		background: none;
		border: none;
		color: inherit;
		font-size: 1rem;
		line-height: 1;
		cursor: pointer;
		padding: 0.4rem;
		border-radius: 0.4rem;
		opacity: 0.55;
	}
	.delete:hover,
	.delete:focus-visible {
		opacity: 1;
		background: var(--hover);
	}
	.delete:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
</style>
