<script lang="ts">
	import type { Tray } from '$lib/types';
	import { TRAY_DIMENSIONS } from '$lib/types';
	import Pocket from './Pocket.svelte';
	import TriangleNotch from './TriangleNotch.svelte';

	let {
		tray,
		compact = false,
		onPocketClick
	}: {
		tray: Tray;
		compact?: boolean;
		onPocketClick?: (row: number, col: number) => void;
	} = $props();

	const dims = $derived(TRAY_DIMENSIONS[tray.size]);
</script>

<div class="tray-wrap" class:compact>
	<div class="notch-row">
		<TriangleNotch count={tray.id} />
	</div>
	<div
		class="tray"
		style="--cols: {dims.cols}; --rows: {dims.rows}; aspect-ratio: {dims.cols} / {dims.rows};"
	>
		{#each tray.pockets as row, r}
			{#each row as pocket, c}
				<div class="cell">
					<Pocket
						{pocket}
						{compact}
						onclick={onPocketClick ? () => onPocketClick(r, c) : undefined}
					/>
				</div>
			{/each}
		{/each}
	</div>
</div>

<style>
	.tray-wrap {
		container-type: inline-size;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		width: 100%;
	}
	.notch-row {
		width: 100%;
		padding: 0 4%;
	}
	.tray {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		grid-template-rows: repeat(var(--rows), 1fr);
		gap: clamp(4px, 2cqw, 12px);
		padding: clamp(6px, 3cqw, 14px);
		border: 2px solid var(--tray-edge);
		border-top: none;
		border-radius: 0 0 14px 14px;
		background: var(--tray-bg);
	}
	.cell {
		display: grid;
		place-items: center;
	}
</style>
