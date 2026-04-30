<script lang="ts">
	import { page } from '$app/state';

	let { children } = $props();
</script>

<svelte:head>
	<title>Seeder</title>
</svelte:head>

<div class="app">
	{@render children()}
</div>

<style>
	:global(:root) {
		--bg: #f4f1e8;
		--surface: #ffffff;
		--border: #d6d1c2;
		--accent: #2f6b2f;
		--accent-soft: #4a8a4a;
		--danger: #b03a3a;
		--hover: #eaf2ea;

		--tray-bg: #f8f5ec;
		--tray-edge: #b8a982;
		--pocket-empty: #e6e2d3;
		--pocket-border: #c8c1ac;
		--pocket-filled: #ffffff;

		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif;
		color: #1a1a1a;
		background: var(--bg);
	}
	@media (prefers-color-scheme: dark) {
		:global(:root) {
			--bg: #1a1f17;
			--surface: #242a20;
			--border: #3b4234;
			--accent: #6fbf6f;
			--accent-soft: #8fd08f;
			--danger: #e07171;
			--hover: #2f3a2c;

			--tray-bg: #2a2f25;
			--tray-edge: #6b6042;
			--pocket-empty: #1f241c;
			--pocket-border: #3a402f;
			--pocket-filled: #354030;

			color: #e8e6dc;
		}
	}
	:global(*) {
		box-sizing: border-box;
	}
	:global(body) {
		margin: 0;
		min-height: 100dvh;
	}
	.app {
		min-height: 100dvh;
		padding-top: env(safe-area-inset-top);
		padding-bottom: env(safe-area-inset-bottom);
		padding-left: env(safe-area-inset-left);
		padding-right: env(safe-area-inset-right);
	}
</style>
