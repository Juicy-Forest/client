<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { deleteCookie } from '$lib/utils/cookies';

	onMount(() => {
		deleteCookie('auth-token');
		goto('/login');
	});
</script>

<div class="min-h-screen flex items-center justify-center">
	<p>Logging out...</p>
</div>
