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

<div class="min-h-screen" class:bg-main={!['/login', '/register', '/createjoin'].includes($page.url.pathname)}>
	{#if !['/login', '/register', '/createjoin'].includes($page.url.pathname)}
	<Navigation gardenData={data ? {...data.currentGarden}: ''}/>
	{/if}

	<div class="page-transition" class:has-nav={!['/login', '/register', '/createjoin'].includes($page.url.pathname)}>
		{#key $page.url.pathname}
			<div class="page-content">
				{@render children()}
			</div>
		{/key}
	</div>
</div>

<style>
	.bg-main {
		background-color: #fdfcf8;
	}

	.page-transition {
		display: grid;
	}
	
	.page-transition.has-nav {
		padding-top: 5rem;
	}
	
	.page-transition > .page-content {
		grid-area: 1 / 1;
		animation: fadeIn 250ms ease-out;
	}
	
	@keyframes fadeIn {
		from {
			opacity: 0.6;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
