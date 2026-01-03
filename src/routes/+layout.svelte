<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
  	import Navigation from '$lib/components/Navigation/Navigation.svelte';
	import { page } from '$app/stores';

	const { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if !['/login', '/register', '/createjoin'].includes($page.url.pathname)}
<Navigation gardenData={data ? {...data.currentGarden}: ''}/>
{/if}

{@render children()}
