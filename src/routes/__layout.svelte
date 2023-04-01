<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '$lib/types/auth';

	export const load: Load = async ({ session }) => {
		const session_data = session as Session;
		if (!session_data.exists) {
			return {
				status: 302,
				redirect: '/register'
			};
		}
		return {};
	};
</script>

<script lang="ts">
	import '../app.css';
</script>

<svelte:head>
	<title>フレッシュマンフェスタ</title>
</svelte:head>

<slot />
