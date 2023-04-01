<script lang="ts">
	import shows_json from '$lib/json/shows.json';
	import H1 from '$lib/components/material/H1.svelte';
	import type { Show } from '$lib/types/json/show';
	import { goto } from '$app/navigation';

	const shows = shows_json as Show[];
</script>

<div
	class="w-full min-h-screen h-full px-4 md:px-8 lg:px-8 py-8 flex place-items-center place-content-center bg-gray-50"
>
	<div class="max-w-sm w-full">
		<H1>Select a date</H1>
		<div class="grid grid-cols-1 gap-y-3 mt-2">
			{#each shows as show}
				<div
					class="rounded-md border px-2 py-4 font-semibold hover:border-primary cursor-pointer group bg-white"
					on:click={() => {
						goto(`/tickets/seats?id=${show.id}`);
					}}
				>
					<p class="group-hover:text-primary text-xl">{show.date}</p>
					<p class="text-gray-400 -mt-1 text-lg">{show.time}</p>
				</div>
			{/each}
		</div>
	</div>
</div>
