<script lang="ts">
	// steps: 'choose' -> initial selection
	// 'create-details' -> form for name + location text
	// 'create-map' -> map selection
	// 'join' -> join code input
	let step: 'choose' | 'create-details' | 'create-map' | 'join' = 'choose';

	// create flow fields
	let gardenName = '';
	let gardenLocationText = '';
	let mapCoords: { lat: number; lng: number } | null = null;

	// join flow
	let gardenCode = '';

	function chooseCreate() {
		step = 'create-details';
	}

	function chooseJoin() {
		step = 'join';
	}

	function continueToMap() {
		// basic validation
		if (!gardenName.trim()) return;
		step = 'create-map';
	}

	function back() {
		if (step === 'create-map') {
			step = 'create-details';
			return;
		}
		if (step === 'create-details') {
			step = 'choose';
			return;
		}
		if (step === 'join') {
			step = 'choose';
			return;
		}
	}

	function onMapClick(e: MouseEvent) {
		const target = e.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		// generate mock lat/lng from position (for demo)
		const lat = ((1 - y / rect.height) * 180 - 90).toFixed(4);
		const lng = ((x / rect.width) * 360 - 180).toFixed(4);
		mapCoords = { lat: +lat, lng: +lng };
		gardenLocationText = `${mapCoords.lat.toFixed(4)}, ${mapCoords.lng.toFixed(4)}`;
	}

	function selectLocation() {
		// placeholder: save garden with coords
		console.log('create garden', { gardenName, gardenLocationText, mapCoords });
		// after creation you might navigate away; keep on map for demo
	}

	function joinWithCode() {
		console.log('join with code', gardenCode);
	}
</script>

<main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 px-4">
	<div class="w-full max-w-3xl">
		<div class="flex flex-col items-center mb-6">
			<div class="bg-emerald-600 rounded-full w-20 h-20 flex items-center justify-center shadow-md">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-10 h-10 text-white" fill="none" stroke="white" stroke-width="1.5">
					<path d="M12 20v-6" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M7 9c1.5-2 4-3 5-3s3.5 1 5 3" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M7 13c1.5 2 4 3 5 3s3.5-1 5-3" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
			<h1 class="mt-4 text-2xl font-medium text-gray-800">Juicy Forest</h1>
			<p class="text-gray-500 mt-2">Manage your garden with ease</p>
		</div>

		<div class="bg-white rounded-xl shadow-lg p-8">
			{#if step === 'choose'}
				<h2 class="text-center text-xl font-semibold text-gray-800">Welcome to Your Garden</h2>
				<p class="text-center text-gray-500 mt-2 mb-6">Do you want to join an existing food garden group or create one?</p>

				<div class="space-y-4">
					<button type="button" on:click={chooseCreate} class="w-full border border-gray-200 rounded-lg py-6 px-4 flex items-center gap-4 hover:shadow-sm focus:outline-none">
						<div class="flex-shrink-0">
							<div class="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M12 5v14M5 12h14" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</div>
						</div>
						<div class="text-left text-gray-700 font-medium">Create New Garden</div>
					</button>

					<button type="button" on:click={chooseJoin} class="w-full border border-gray-200 rounded-lg py-6 px-4 flex items-center gap-4 hover:shadow-sm focus:outline-none">
						<div class="flex-shrink-0">
							<div class="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M16 11V7a4 4 0 10-8 0v4" stroke-linecap="round" stroke-linejoin="round"/>
									<rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</div>
						</div>
						<div class="text-left text-gray-700 font-medium">Join Existing Garden</div>
					</button>
				</div>

			{:else if step === 'create-details'}
				<button class="mb-4 text-sm text-gray-600 flex items-center gap-2" on:click={back}>&larr; Back</button>
				<h2 class="text-2xl font-semibold text-gray-800">Garden Details</h2>
				<p class="text-gray-500 mt-2 mb-6">Choose a name for your garden and enter its location</p>

				<div class="mb-5">
					<label for="gardenName" class="block text-sm font-semibold text-gray-800 mb-2">Name</label>
					<input id="gardenName" type="text" bind:value={gardenName} placeholder="e.g., Community Garden" class="w-full bg-gray-100 rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
				</div>

				<div class="mb-6">
					<label for="gardenLocation" class="block text-sm font-semibold text-gray-800 mb-2">Location</label>
					<input id="gardenLocation" type="text" bind:value={gardenLocationText} placeholder="e.g., 123 Main Street, City" class="w-full bg-gray-100 rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
				</div>

				<div class="flex justify-end">
					<button class="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold" on:click={continueToMap}>Continue to Map</button>
				</div>

			{:else if step === 'create-map'}
				<button class="mb-4 text-sm text-gray-600 flex items-center gap-2" on:click={back}>&larr; Back</button>
				<h2 class="text-2xl font-semibold text-gray-800">Location</h2>
				<p class="text-gray-500 mt-2 mb-4">Click on the map to mark the location of your garden</p>

				<div class="mb-4">
					<div class="bg-gray-100 rounded-md px-4 py-2 text-sm text-gray-600 flex items-center gap-3">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						<span>{mapCoords ? `${mapCoords.lat.toFixed(4)} • ${mapCoords.lng.toFixed(4)}` : '–  –'}</span>
					</div>
				</div>

				<div class="bg-white border border-gray-200 rounded-md overflow-hidden mb-4">
					<div on:click={onMapClick} role="button" tabindex="0" class="h-64 bg-gradient-to-br from-sky-100 to-sky-200 cursor-pointer flex items-center justify-center">
						{#if mapCoords}
							<div class="text-sm text-gray-700">Selected: {mapCoords.lat.toFixed(4)}, {mapCoords.lng.toFixed(4)}</div>
						{:else}
							<div class="text-sm text-gray-500">Click anywhere to select a location</div>
						{/if}
					</div>
				</div>

				<div class="flex justify-between items-center">
					<button class="px-4 py-2 rounded bg-white border" on:click={back}>Back</button>
					<button class="px-4 py-2 rounded bg-gray-700 text-white" on:click={selectLocation} disabled={!mapCoords}>Select a Location</button>
				</div>

			{:else if step === 'join'}
				<button class="mb-4 text-sm text-gray-600 flex items-center gap-2" on:click={back}>&larr; Back</button>
				<h2 class="text-2xl font-semibold text-gray-800">Join Existing Garden</h2>
				<p class="text-gray-500 mt-2 mb-4">Enter the garden code provided by your admin</p>

				<div class="mt-2 flex items-center gap-3">
					<input type="text" bind:value={gardenCode} placeholder="Enter garden code" class="flex-1 bg-gray-100 rounded-md px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
					<button class="bg-gray-600 text-white px-4 py-3 rounded-md" on:click={joinWithCode}>Join</button>
				</div>
				<p class="text-center text-gray-500 text-sm mt-3">Ask your garden admin for the access code</p>
			{/if}
		</div>

		<p class="text-center text-gray-500 mt-6">Need help? <a href="/contact" class="text-emerald-600 font-semibold">Contact support</a></p>
	</div>
</main>
*** End Patch
