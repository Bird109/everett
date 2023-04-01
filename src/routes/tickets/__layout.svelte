<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '$lib/types/auth';
	import { start_time } from '$lib/utils/auth';

	export const load: Load = async ({ session }) => {
		const session_data = session as Session;
		const remaining_sec = Math.ceil((start_time - new Date().getTime()) / 1000);
		if (remaining_sec > 0) {
			return {
				status: 302,
				redirect: '/countdown'
			};
		}
		if (session_data.booked) {
			return {
				status: 302,
				redirect: '/'
			};
		}
		return {};
	};
</script>

<slot />
