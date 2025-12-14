<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
  	import Navigation from '$lib/components/Navigation/Navigation.svelte';

	const { data, children } = $props();
	console.log('Layout data:', data)

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Navigation />

{@render children()}
