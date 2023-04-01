<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '$lib/types/auth';
	import { start_time } from '$lib/utils/auth';
	import { session } from '$app/stores';

	export const load: Load = async ({ session }) => {
		const session_data = session as Session;
		const remaining_sec = Math.ceil((start_time - new Date().getTime()) / 1000);
		if (remaining_sec > 0) {
			return {
				status: 302,
				redirect: '/countdown'
			};
		}
		if (!session_data.booked) {
			return {
				status: 302,
				redirect: '/tickets'
			};
		}
		return {};
	};

	const cancel = async () => {
		await fetch('/api/tickets/cancel', {
			method: 'POST',
			credentials: 'same-origin'
		});
		window.location.href = '/';
	};
</script>

<script lang="ts">
	const seat_id = $session['seat'];

	import type { Show } from '$lib/types/json/show';
	import shows_json from '$lib/json/shows.json';
	import { num_to_Alphabet } from '$lib/utils/format';
	import Logo from '$lib/components/Logo.svelte';

	const shows = shows_json as Show[];
	const id = Number(seat_id.split('-')[0]);

	const selected_show = shows.reduce((prev, curr) => {
		if (curr.id === id) return curr;
		return prev;
	}, null);
</script>

<Logo />
<div class="h-screen w-screen flex place-items-center place-content-center px-4 bg-gray-50">
	<div class="max-w-sm w-full">
		<div class="border rounded-lg py-2 px-4 bg-white">
			<p class="text-7xl font-bold text-primary py-6">
				{num_to_Alphabet(Number(seat_id.split('-')[1]))}-{seat_id.split('-')[2]}
			</p>
			<div class="py-1 pb-4">
				<p class="font-medium">{selected_show.date} {selected_show.time}</p>
				<p class="text-sm -mt-0.5">視聴覚ホール</p>
			</div>
		</div>
		<div class="w-fit mx-auto mt-8">
			<button class="text-red-400 hover:underline text-sm" on:click|once={cancel}
				>予約をキャンセル</button
			>
		</div>
	</div>
</div>
