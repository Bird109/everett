<script lang="ts">
	let email: string;
	let name: string;
	let password: string;
	let message: string;
	let end_screen = false;
	let loading = false;

	import Textfield from '$lib/components/material/Textfield.svelte';
	import ButtonPrimary from '$lib/components/material/ButtonPrimary.svelte';
	import H1 from '$lib/components/material/H1.svelte';
	import type { ApiError } from '$lib/types/endpoints';

	const signup = async () => {
		if (!email || !name || !password) return;
		if (!email.includes('@')) return (message = 'メールアドレスが存在しません。');
		if (password.length < 6) return (message = 'パスワードは6桁以上です。');
		loading = true;
		message = null;
		href='/tickets'
		const response = await fetch('/api/auth/email', {
			method: 'POST',
			body: JSON.stringify({ email, name, password })
		});
		if (!response.ok) {
			const result = (await response.json()) as ApiError;
			message = result.ja_message;
			loading = false;
			return;
		}
		end_screen = true;
	};
</script>

{#if end_screen}
	<div class="w-screen h-screen absolute top-0 bg-white flex place-items-center z-50 px-4">
		<div class="max-w-sm w-full mx-auto">
			<p>
				メールアドレス確認のため、<span class="text-primary">{email}</span> に nishi.reservation@gmail.com
				からメールが配信されました。迷惑メールフォルダーに保存されている可能性があります。
			</p>
			<button class="mt-4 hover:underline text-primary cursor-pointer" on:click={signup}
				>再配信</button
			>
		</div>
	</div>
{/if}
<div class="w-full min-h-screen flex place-items-center place-content-center">
	<div class="max-w-sm w-full p-4">
		<H1>Register</H1>
		<div class="mb-4 mt-2">
			<Textfield label="名前" bind:value={name} />
			<Textfield label="メールアドレス" bind:value={email} />
			<Textfield label="パスワード" type="password" bind:value={password} />
		</div>
		{#if message}
			<p class="text-sm text-red-400">{message}</p>
		{/if}
		<ButtonPrimary on:click={signup} disabled={loading}>Continue</ButtonPrimary>
		<div class="mx-auto w-fit mt-1">
			<a class="text-sm text-primary hover:underline cursor-pointer" href="/signin"
				>登録済みの方はこちら</a
			>
		</div>
	</div>
</div>
