<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
  	import Navigation from '$lib/components/Navigation/Navigation.svelte';
	import { page } from '$app/stores';
    import { setContext } from 'svelte';

	const { data, children } = $props();
  // Using context instead of dumb url params would be better but
  // I cba to deal with this ai slop that someone wrote.
  // setContext('currentGarden', {...data.currentGarden})
  // console.log(data)
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if !['/login', '/register', '/createjoin'].includes($page.url.pathname)}
<Navigation gardenData={data ? {...data.currentGarden}: ''}/>
{/if}

{@render children()}
