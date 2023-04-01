<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { start_time } from '$lib/utils/auth';

	export const load: Load = async ({ session }) => {
		const remaining_sec = Math.ceil((start_time - new Date().getTime()) / 1000);
		if (remaining_sec <= 0) {
			return {
				status: 302,
				redirect: '/tickets'
			};
		}
		return {};
	};
</script>

<script lang="ts">
	import { formatTime } from '$lib/utils/format';
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

	import Logo from '$lib/components/Logo.svelte';

	let remaining_sec = Math.ceil((start_time - new Date().getTime()) / 1000);

	const interval = setInterval(() => {
		const current_date = new Date();
		remaining_sec = Math.ceil((start_time - current_date.getTime()) / 1000);
		if (remaining_sec <= 0) {
			clearInterval(interval);
			setTimeout(() => {
				goto('/tickets');
			}, 1000);
		}
	}, 1000);

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<Logo />
<div class="flex min-h-screen w-full place-items-center place-content-center">
	<div>
		<div class="text-primary font-medium">予約開始まで</div>
		<p class="tabular-nums text-5xl sm:text-6xl font-semibold">{formatTime(remaining_sec)}</p>
	</div>
</div>
