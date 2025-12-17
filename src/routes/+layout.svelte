<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
  	import Navigation from '$lib/components/Navigation/Navigation.svelte';
  import { globalData } from '$lib/state/data.js';

	const { data, children } = $props();
	if($globalData.userDataState) {
		globalData.set({
			userDataState: data.userData,
			gardenDataState: data.gardenData,
			sectionDataState: data.sectionData,
			activeGardenState: data.gardenData[0]
		})
	} else {

		globalData.update((d) => ({
			...d,
			sectionDataState: data.sectionData,
			gardenDataState: data.gardenData,
			activeGardenState: data.gardenData[0]
		}))
	}
</script>
 
<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Navigation gardenData={data ? {...data.gardenData[0]}: ''}/>

{@render children()}
