<script lang="ts">
	import type { Arrangement } from '$lib/types/json/arrangement';
	import type { Chart, Seat } from '$lib/types/seats';

	import { onMount, createEventDispatcher } from 'svelte';
	import Panzoom from 'panzoom';

	export let chart: Chart;
	export let arrangement: Arrangement;

	const box_width = arrangement.box.x;
	const box_height = arrangement.box.y;

	const dispatch = createEventDispatcher();

	let selected_seat: Seat = null;
	let div_width: number;
	let map_element: HTMLDivElement;

	onMount(() => {
		Panzoom(map_element, {
			bounds: true,
			boundsPadding: 0.2,
			maxZoom: 5,
			minZoom: 0.9,
			initialZoom: 1
		});
	});

	const selectSeat = (seat: Seat) => {
		if (seat.status === -1) return;
		selected_seat = seat;
		dispatch('select', selected_seat);
	};
</script>

<div
	class="flex flex-grow bg-white place-items-center h-full overflow-hidden"
	bind:clientWidth={div_width}
>
	<div
		class="w-full cursor-grab active:cursor-grabbing"
		style="height:{(div_width * box_height) / box_width}px;"
		bind:this={map_element}
	>
		<svg class="w-full h-full">
			{#each Array(box_height) as _, y_index}
				{#each Array(box_width) as _, x_index}
					{@const y = y_index + 1}
					{@const x = x_index + 1}
					{@const seat = chart[y][x]}
					{#if seat.status !== null && seat.seat}
						{#if selected_seat && selected_seat.seat.x === seat.seat.x && selected_seat.seat.y === seat.seat.y}
							<rect
								x="{(x_index / box_width) * 100}%"
								y="{(y_index / box_height) * 100}%"
								width="{100 / box_width - 1}%"
								height="{100 / box_height - (1 / box_height) * box_width}%"
								opacity="100%"
								class="fill-current text-primary cursor-pointer"
							/>
						{:else}
							<rect
								x="{(x_index / box_width) * 100}%"
								y="{(y_index / box_height) * 100}%"
								width="{100 / box_width - 1}%"
								height="{100 / box_height - (1 / box_height) * box_width}%"
								opacity="100%"
								stroke-width="0.2%"
								class="text-primary fill-current"
								class:seat-disabled={seat.status === -1}
								class:seat-booked={seat.status === 1}
								class:seat-available={seat.status === 0}
								on:click|stopPropagation={() => {
									selectSeat(seat);
								}}
								on:touchend|stopPropagation={() => {
									selectSeat(seat);
								}}
							/>
						{/if}
					{/if}
				{/each}
			{/each}
		</svg>
	</div>
</div>

<style lang="postcss">
	.seat-disabled {
		@apply text-gray-200;
	}
	.seat-booked {
		@apply text-black;
	}
	.seat-available {
		@apply text-white cursor-pointer stroke-black stroke-1;
	}
</style>
