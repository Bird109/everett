<script lang="ts">
	export let disabled = false;
</script>

<button
	class="w-full rounded-md bg-primary py-1.5 px-4 font-medium text-white whitespace-nowrap"
	class:opacity-80={disabled}
	class:hover:bg-primary-dark={!disabled}
	{disabled}
	on:click
>
	<slot />
</button>
