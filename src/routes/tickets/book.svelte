<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = ({ url }) => {
		const seat = url.searchParams.get('seat');
		if (!seat) {
			return {
				redirect: '/tickets',
				status: 302
			};
		}
		return {
			props: {
				seat
			}
		};
	};
</script>

<script lang="ts">
	import Loading from '$lib/components/material/Loading.svelte';
	import type { ApiError } from '$lib/types/endpoints';

	export let seat: string;

	interface Result {
		success: boolean;
		message: string;
	}

	const book = async (): Promise<Result> => {
		if (!seat) {
			return {
				success: false,
				message: 'エラー'
			};
		}
		const book_seat = await fetch('/api/tickets/book', {
			method: 'POST',
			body: JSON.stringify({ seat }),
			credentials: 'same-origin'
		});
		if (!book_seat.ok) {
			const { ja_message } = (await book_seat.json()) as ApiError;
			return {
				success: false,
				message: ja_message
			};
		}
		return {
			success: true,
			message: '予約が完了しました。'
		};
	};
</script>

<div class="h-screen w-screen flex place-items-center place-content-center px-4">
	{#await book()}
		<Loading />
	{:then result}
		{#if result.success}
			<div>
				<p class="font-medium">{result.message}</p>
				<div class="mx-auto w-fit mt-1">
					<button
						on:click={() => {
							window.location.href = '/';
						}}
						class="text-sm hover:underline text-primary">戻る</button
					>
				</div>
			</div>
		{:else}
			<div>
				<p class="font-medium text-red-400">{result.message}</p>
				<div class="mx-auto w-fit mt-1">
					<a href="/tickets" class="text-sm hover:underline">戻る</a>
				</div>
			</div>
		{/if}
	{/await}
</div>
