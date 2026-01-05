<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { selectedGardenId } from '$lib/stores/gardenStore.ts';

	export let data: PageData;

	// steps: 'choose' -> initial selection
	// 'create-details' -> form for name + description
	// 'join' -> join code input
	let step: 'choose' | 'create-details' | 'join' = 'choose';

	// create flow fields
	let gardenName = '';
	let gardenLocation = '';
	let error = '';
	let success = '';
	let createdGardenCode = '';

	// join flow
	let gardenCode = '';
	let joinError = '';
	let joinSuccess = '';

	// joined gardens from server
	$: joinedGardens = data.joinedGardens || [];

	function chooseCreate() {
		step = 'create-details';
		error = '';
		success = '';
		createdGardenCode = '';
	}

	function chooseJoin() {
		step = 'join';
		joinError = '';
		joinSuccess = '';
	}

	function back() {
		if (step === 'create-details') {
			step = 'choose';
			return;
		}
		if (step === 'join') {
			step = 'choose';
			return;
		}
	}

	function selectGarden(garden: any) {
		console.log('Selected garden:', garden);
		selectedGardenId.set(garden._id)
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

				{#if joinedGardens.length > 0}
					<div class="mb-6">
						<h3 class="text-lg font-semibold text-gray-800 mb-3">Your Gardens</h3>
						<div class="grid gap-3 md:grid-cols-2">
							{#each joinedGardens as garden}
								<button on:click={() => selectGarden(garden)} class="border border-gray-200 rounded-lg p-4 hover:shadow-sm focus:outline-none text-left">
									<div class="flex items-center gap-3">
										<div class="bg-green-100 rounded-full w-10 h-10 flex items-center justify-center">
											<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<path d="M12 20v-6" stroke-linecap="round" stroke-linejoin="round"/>
												<path d="M7 9c1.5-2 4-3 5-3s3.5 1 5 3" stroke-linecap="round" stroke-linejoin="round"/>
												<path d="M7 13c1.5 2 4 3 5 3s3.5-1 5-3" stroke-linecap="round" stroke-linejoin="round"/>
											</svg>
										</div>
										<div>
											<div class="font-medium text-gray-800">{garden.name}</div>
											<div class="text-sm text-gray-500">{garden.members?.length || 0} members</div>
										</div>
									</div>
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<div class="flex gap-4">
					<button type="button" on:click={chooseCreate} class="flex-1 border border-gray-200 rounded-lg py-6 px-4 flex items-center gap-4 hover:shadow-sm focus:outline-none">
						<div class="flex-shrink-0">
							<div class="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M12 5v14M5 12h14" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</div>
						</div>
						<div class="text-left text-gray-700 font-medium">Create New Garden</div>
					</button>

					<button type="button" on:click={chooseJoin} class="flex-1 border border-gray-200 rounded-lg py-6 px-4 flex items-center gap-4 hover:shadow-sm focus:outline-none">
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
				<h2 class="text-2xl font-semibold text-gray-800">Food Garden Details</h2>
				<p class="text-gray-500 mt-2 mb-6">Choose a name and location for your food garden</p>

				<form method="POST" action="?/create" use:enhance={() => {
					return async ({ update, result }) => {
						if (result.type === 'success') {
							success = result.data?.message as string;
							createdGardenCode = result.data?.garden?.joinCode;
							gardenName = '';
							gardenLocation = '';
						} else if (result.type === 'failure') {
							error = result.data?.error as string;
						}
						update();
					};
				}}>
					<div class="mb-5">
						<label for="name" class="block text-sm font-semibold text-gray-800 mb-2">Name</label>
						<input id="name" name="name" type="text" bind:value={gardenName} placeholder="e.g., Community Vegetable Garden" class="w-full bg-gray-100 rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" required />
					</div>

					<div class="mb-6">
						<label for="location" class="block text-sm font-semibold text-gray-800 mb-2">Location</label>
						<input id="location" name="location" type="text" bind:value={gardenLocation} placeholder="e.g., 123 Main Street, City" class="w-full bg-gray-100 rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" required />
					</div>

					{#if error}
						<p class="text-red-600 text-sm mb-4">{error}</p>
					{/if}

					{#if success}
						<div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
							<p class="text-green-800 text-sm mb-2">{success}</p>
							{#if createdGardenCode}
								<div class="bg-white rounded-md px-3 py-2 border border-green-300">
									<p class="text-sm text-gray-600 mb-1">Garden Code:</p>
									<p class="text-lg font-mono font-semibold text-green-800">{createdGardenCode}</p>
									<p class="text-xs text-gray-500 mt-1">Share this code with others to join your garden</p>
								</div>
							{/if}
						</div>
					{/if}

					<div class="flex justify-end">
						<button type="submit" class="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700">Create Food Garden</button>
					</div>
				</form>

			{:else if step === 'join'}
				<button class="mb-4 text-sm text-gray-600 flex items-center gap-2" on:click={back}>&larr; Back</button>
				<h2 class="text-2xl font-semibold text-gray-800">Join Existing Garden</h2>
				<p class="text-gray-500 mt-2 mb-4">Enter the garden code provided by your admin</p>

				<form method="POST" action="?/join" use:enhance={() => {
					return async ({ update, result }) => {
						if (result.type === 'success') {
							joinSuccess = result.data?.message as string;
							gardenCode = '';
							// Reload to update garden list
							setTimeout(() => window.location.reload(), 1500);
						} else if (result.type === 'failure') {
							joinError = result.data?.error as string;
						}
						update();
					};
				}}>
					<div class="mt-2 flex items-center gap-3">
						<input name="joinCode" type="text" bind:value={gardenCode} placeholder="Enter garden code" class="flex-1 bg-gray-100 rounded-md px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" required />
						<button type="submit" class="bg-gray-600 text-white px-4 py-3 rounded-md">Join</button>
					</div>

					{#if joinError}
						<p class="text-red-600 text-sm mt-4">{joinError}</p>
					{/if}

					{#if joinSuccess}
						<p class="text-green-600 text-sm mt-4">{joinSuccess}</p>
					{/if}
				</form>

				<p class="text-center text-gray-500 text-sm mt-3">Ask your garden admin for the access code</p>
			{/if}
		</div>

		<p class="text-center text-gray-500 mt-6">Need help? <a href="/contact" class="text-emerald-600 font-semibold">Contact support</a></p>
	</div>
</main>
*** End Patch
