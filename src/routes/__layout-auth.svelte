<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '$lib/types/auth';

	export const load: Load = async ({ session }) => {
		const session_data = session as Session;
		if (!session_data.exists) return {};
		return {
			status: 302,
			redirect: '/'
		};
	};
</script>

<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import '../app.css';
</script>

<svelte:head>
	<title>フレッシュマンフェスタ</title>
</svelte:head>

<Logo />
<div class="auth">
	<slot />
</div>
