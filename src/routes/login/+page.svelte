<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<main class="login">
	<h1>🌱 Seeder</h1>
	<form method="POST" use:enhance>
		<label>
			<span>Password</span>
			<input
				type="password"
				name="password"
				autocomplete="current-password"
				autocapitalize="none"
				autocorrect="off"
				required
				autofocus
			/>
		</label>
		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}
		<button type="submit">Sign in</button>
	</form>
</main>

<style>
	.login {
		min-height: 100dvh;
		display: grid;
		place-items: center;
		padding: max(env(safe-area-inset-top), 1rem) 1rem max(env(safe-area-inset-bottom), 1rem);
	}
	h1 {
		font-size: 2rem;
		margin: 0 0 1.5rem;
		text-align: center;
	}
	form {
		display: grid;
		gap: 1rem;
		width: min(100%, 22rem);
	}
	label {
		display: grid;
		gap: 0.4rem;
		font-size: 0.95rem;
	}
	input {
		font-size: 1rem;
		padding: 0.85rem 1rem;
		border-radius: 0.6rem;
		border: 1px solid var(--border);
		background: var(--surface);
		color: inherit;
	}
	input:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
	button {
		font-size: 1rem;
		padding: 0.85rem 1rem;
		border-radius: 0.6rem;
		border: none;
		background: var(--accent);
		color: white;
		font-weight: 600;
		cursor: pointer;
		min-height: 44px;
	}
	.error {
		color: #c0392b;
		margin: 0;
		font-size: 0.9rem;
	}
</style>
