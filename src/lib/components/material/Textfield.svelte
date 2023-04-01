<script lang="ts">
	export let value = '';
	export let type: 'text' | 'password' = 'text';
	export let label = '';

	const handleInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		value = target.value;
	};
</script>

<div class="w-full">
	{#if label}
		<label class="text-sm" for={label}>{label}</label>
	{/if}
	<input
		class="w-full appearance-none rounded border px-2 py-1.5 outline-none"
		{value}
		{type}
		on:input={handleInput}
		on:keydown
	/>
</div>
