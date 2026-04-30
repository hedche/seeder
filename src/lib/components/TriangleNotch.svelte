<script lang="ts">
	// Renders `count` inward-pointing triangle notches centred on the top edge of
	// the tray. Notch count == tray id, matching the physical cut-outs.
	let { count, width = 100, height = 12 }: { count: number; width?: number; height?: number } =
		$props();

	const notchWidth = 12;
	const notchSpacing = 4;
	const totalWidth = count * notchWidth + (count - 1) * notchSpacing;
	const startX = (width - totalWidth) / 2;
</script>

<svg viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
	<rect x="0" y="0" width={width} height={height} fill="var(--tray-edge)" />
	{#each Array(count) as _, i}
		{@const x = startX + i * (notchWidth + notchSpacing)}
		<polygon
			points="{x},0 {x + notchWidth},0 {x + notchWidth / 2},{height - 2}"
			fill="var(--bg)"
		/>
	{/each}
</svg>

<style>
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
</style>
