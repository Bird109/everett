<script lang="ts">
	let email: string;
	let password: string;
	let message: string;
	let loading = false;

	import Textfield from '$lib/components/material/Textfield.svelte';
	import ButtonPrimary from '$lib/components/material/ButtonPrimary.svelte';
	import H1 from '$lib/components/material/H1.svelte';
	import type { ApiError } from '$lib/types/endpoints';

	const signin = async () => {
		message = null;
		loading = true;
		const response = await fetch('/api/auth/signin', {
			method: 'POST',
			body: JSON.stringify({ email, password })
		});
		if (!response.ok) {
			const error = (await response.json()) as ApiError;
			message = error.ja_message;
			loading = false;
			return;
		}
		window.location.href = '/';
	};
</script>

<div class="w-full min-h-screen flex place-items-center place-content-center">
	<div class="max-w-sm w-full p-4">
		<H1>Sign in</H1>
		<div class="mb-4">
			<Textfield label="メールアドレス" bind:value={email} />
			<Textfield label="パスワード" type="password" bind:value={password} />
		</div>
		{#if message}
			<p class="text-sm text-red-400">{message}</p>
		{/if}
		<ButtonPrimary on:click={signin} disabled={loading}>Continue</ButtonPrimary>
		<ButtonPrimary on:click={signin}=location.href='$routes/tickets'>
		<div class="mx-auto w-fit mt-1">
			<a class="text-sm text-primary hover:underline cursor-pointer" href="/register">新規登録</a>
		</div>
	</div>
</div>
