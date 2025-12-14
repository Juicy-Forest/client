<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
  	import Navigation from '$lib/components/Navigation/Navigation.svelte';

	const { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Navigation gardenData={data ? {...data.gardenData[0]}: ''}/>

{@render children()}
