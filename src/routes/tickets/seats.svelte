<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = ({ url }) => {
		const id = url.searchParams.get('id');
		if (!id) {
			return {
				redirect: '/tickets',
				status: 302
			};
		}
		return {
			props: {
				id: Number(id)
			}
		};
	};
</script>

<script lang="ts">
	export let id: number;

	import { createChart } from '$lib/utils/seats';
	import { num_to_Alphabet } from '$lib/utils/format';
	import { goto } from '$app/navigation';
	import seats_json from '$lib/json/seats.json';
	import arrangement_json from '$lib/json/arrangement.json';
	import shows_json from '$lib/json/shows.json';

	import ChartBlock from '$lib/components/book/Chart.svelte';
	import ButtonPrimary from '$lib/components/material/ButtonPrimary.svelte';
	import H1 from '$lib/components/material/H1.svelte';

	import type { Show } from '$lib/types/json/show';
	import type { AvailableSeats } from '$lib/types/json/seats';
	import type { Arrangement } from '$lib/types/json/arrangement';
	import type { Chart, Seat } from '$lib/types/seats';
	import Loading from '$lib/components/material/Loading.svelte';

	const seats = seats_json as AvailableSeats;
	const arrangement = arrangement_json as Arrangement;
	const shows = shows_json as Show[];

	const selected_show = shows.reduce((prev, curr) => {
		if (curr.id === id) return curr;
		return prev;
	}, null);

	let chart: Chart = {};

	let selected_seat: Seat;

	const handleSelect = (e: CustomEvent) => {
		selected_seat = e.detail as Seat;
	};

	const book = () => {
		if (!selected_seat) return;
		if (selected_seat.status !== 0) return;
		const seat = `${id}-${selected_seat.seat.y}-${selected_seat.seat.x}`;
		goto(`/tickets/book?seat=${seat}`);
	};

	const load = async (): Promise<void> => {
		const response = await fetch(`/api/tickets/seats?id=${id}`);
		if (!response.ok) throw new Error();
		const result = await response.json();
		const booked = result.data;
		chart = createChart(arrangement, seats, booked, id);
		return;
	};
</script>

<div class="w-full h-screen flex flex-col-reverse lg:flex-row divide-x">
	<div
		class="w-full lg:min-w-sm lg:max-w-sm md:h-2/5 h-1/2 lg:h-full px-4 py-8 flex flex-col place-content-between bg-gray-50"
	>
		<div>
			<H1>Select a seat</H1>
			<p class="font-medium text-primary">{selected_show.date} {selected_show.time}</p>
			<div class="mt-12 md:mt-6 lg:mt-12">
				<p class="font-medium text-gray-300">Selected</p>
				{#if selected_seat}
					<p class="text-6xl font-semibold text-primary">
						{num_to_Alphabet(selected_seat.seat.y)}-{selected_seat.seat.x}
					</p>
				{:else}
					<p class="text-6xl font-semibold text-gray-300">-</p>
				{/if}
			</div>
		</div>
		<div>
			<ButtonPrimary disabled={!selected_seat || selected_seat.status !== 0} on:click={book}
				>Confirm</ButtonPrimary
			>
			<div class="mx-auto w-fit mt-2">
				<a class=" hover:underline cursor-pointer text-sm" href="/tickets">Return</a>
			</div>
		</div>
	</div>
	<div class="grow lg:h-full bg-white">
		{#await load()}
			<div class="w-full flex h-full place-items-center place-content-center">
				<Loading />
			</div>
		{:then}
			<ChartBlock {chart} {arrangement} on:select={handleSelect} />
		{/await}
	</div>
</div>
