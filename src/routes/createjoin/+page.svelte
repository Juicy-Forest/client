<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

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
		goto('/?gardenId=' + garden._id);
	}

	function copyCode(code: string) {
		navigator.clipboard.writeText(code);
		alert('Code copied to clipboard!');
	}
</script>

<main class="min-h-screen flex items-center justify-center bg-[#fdfcf8] px-4 py-12">
	<div class="w-full max-w-3xl">
		<div class="flex flex-col items-center mb-8">
			<div class="bg-lime-600 rounded-2xl w-20 h-20 flex items-center justify-center shadow-lg">
				<i class="fa-solid fa-seedling text-white text-4xl"></i>
			</div>
			<h1 class="mt-4 text-3xl font-bold tracking-tight text-stone-800">Juicy Forest</h1>
			<p class="text-stone-500 mt-2 text-sm">Manage your garden with ease</p>
		</div>

		<div class="bg-white/80 backdrop-blur-xl rounded-2xl border border-stone-200/60 shadow-xl shadow-stone-200/20 p-8">
			{#if step === 'choose'}
				<h2 class="text-center text-xl font-bold text-stone-800">Welcome to Your Garden</h2>
				<p class="text-center text-stone-500 text-sm mt-2 mb-6">Do you want to join an existing food garden group or create one?</p>

				{#if joinedGardens.length > 0}
					<div class="mb-6">
						<h3 class="text-base font-bold text-stone-800 mb-3">Your Gardens</h3>
						<div class="grid gap-3 md:grid-cols-2">
							{#each joinedGardens as garden}
								<button onclick={() => selectGarden(garden)} class="group rounded-2xl border border-stone-200 bg-white/60 p-4 text-left transition-all hover:bg-stone-50 hover:border-stone-300 hover:shadow-sm focus:outline-none">
									<div class="flex items-center gap-3">
										<div class="bg-lime-100 rounded-xl w-10 h-10 flex items-center justify-center shrink-0">
											<i class="fa-solid fa-seedling text-lime-600"></i>
										</div>
										<div class="min-w-0">
											<div class="font-semibold text-stone-800 truncate">{garden.name}</div>
											<div class="text-xs text-stone-500">{garden.members?.length || 0} members</div>
											<div class="text-xs text-stone-400 mt-1">
												Code: <span class="cursor-pointer font-mono text-stone-600 hover:text-lime-600 transition-colors" onclick={(e) => { e.stopPropagation(); copyCode(garden.joinCode || 'N/A'); }}>{garden.joinCode || 'N/A'}</span>
											</div>
										</div>
									</div>
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<div class="flex flex-col sm:flex-row gap-4">
					<button type="button" onclick={chooseCreate} class="flex-1 rounded-2xl border border-stone-200 bg-white/60 py-6 px-4 flex items-center gap-4 transition-all hover:bg-stone-50 hover:border-stone-300 hover:shadow-sm focus:outline-none">
						<div class="flex-shrink-0">
							<div class="bg-lime-100 rounded-xl w-12 h-12 flex items-center justify-center">
								<i class="fa-solid fa-plus text-lime-600 text-lg"></i>
							</div>
						</div>
						<div class="text-left">
							<div class="font-semibold text-stone-800">Create New Garden</div>
							<div class="text-xs text-stone-500 mt-0.5">Start your own garden</div>
						</div>
					</button>

					<button type="button" onclick={chooseJoin} class="flex-1 rounded-2xl border border-stone-200 bg-white/60 py-6 px-4 flex items-center gap-4 transition-all hover:bg-stone-50 hover:border-stone-300 hover:shadow-sm focus:outline-none">
						<div class="flex-shrink-0">
							<div class="bg-sky-100 rounded-xl w-12 h-12 flex items-center justify-center">
								<i class="fa-solid fa-users text-sky-600 text-lg"></i>
							</div>
						</div>
						<div class="text-left">
							<div class="font-semibold text-stone-800">Join Existing Garden</div>
							<div class="text-xs text-stone-500 mt-0.5">Enter a garden code</div>
						</div>
					</button>
				</div>

			{:else if step === 'create-details'}
				<button class="mb-4 text-sm text-stone-500 flex items-center gap-2 hover:text-stone-700 transition-colors" onclick={back}>
					<i class="fa-solid fa-arrow-left"></i> Back
				</button>
				<h2 class="text-xl font-bold text-stone-800">Food Garden Details</h2>
				<p class="text-stone-500 text-sm mt-2 mb-6">Choose a name and location for your food garden</p>

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
						<label for="name" class="block text-sm font-semibold text-stone-700 mb-2">Name</label>
						<input id="name" name="name" type="text" bind:value={gardenName} placeholder="e.g., Community Vegetable Garden" class="w-full rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 transition-all focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/20" required />
					</div>

					<div class="mb-6">
						<label for="location" class="block text-sm font-semibold text-stone-700 mb-2">Location</label>
						<input id="location" name="location" type="text" bind:value={gardenLocation} placeholder="e.g., 123 Main Street, City" class="w-full rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 transition-all focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/20" required />
					</div>

					{#if error}
						<div class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-200">
							<i class="fa-solid fa-circle-exclamation mr-1.5"></i>
							{error}
						</div>
					{/if}

					{#if success}
						<div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4">
							<div class="flex items-center gap-2 mb-3">
								<i class="fa-solid fa-circle-check text-emerald-600"></i>
								<p class="text-emerald-800 text-sm font-semibold">{success}</p>
							</div>
							{#if createdGardenCode}
								<div class="bg-white rounded-xl px-4 py-3 border border-emerald-300">
									<p class="text-xs text-stone-600 mb-1.5">Garden Code</p>
									<p class="text-lg font-mono font-bold text-emerald-800">{createdGardenCode}</p>
									<p class="text-xs text-stone-500 mt-2">Share this code with others to join your garden</p>
								</div>
							{/if}
						</div>
					{/if}

					<div class="flex justify-end">
						<button type="submit" class="bg-lime-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all hover:bg-lime-700 hover:shadow-md">Create Food Garden</button>
					</div>
				</form>

			{:else if step === 'join'}
				<button class="mb-4 text-sm text-stone-500 flex items-center gap-2 hover:text-stone-700 transition-colors" onclick={back}>
					<i class="fa-solid fa-arrow-left"></i> Back
				</button>
				<h2 class="text-xl font-bold text-stone-800">Join Existing Garden</h2>
				<p class="text-stone-500 text-sm mt-2 mb-4">Enter the garden code provided by your admin</p>

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
						<input name="joinCode" type="text" bind:value={gardenCode} placeholder="Enter garden code" class="flex-1 rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 transition-all focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/20 font-mono" required />
						<button type="submit" class="bg-lime-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all hover:bg-lime-700 hover:shadow-md">Join</button>
					</div>

					{#if joinError}
						<div class="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-200">
							<i class="fa-solid fa-circle-exclamation mr-1.5"></i>
							{joinError}
						</div>
					{/if}

					{#if joinSuccess}
						<div class="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-600 border border-emerald-200">
							<i class="fa-solid fa-circle-check mr-1.5"></i>
							{joinSuccess}
						</div>
					{/if}
				</form>

				<div class="mt-6 rounded-xl bg-stone-50 border border-stone-200 p-4 text-center">
					<i class="fa-solid fa-info-circle text-stone-400 mb-2"></i>
					<p class="text-stone-500 text-xs">Ask your garden admin for the access code</p>
				</div>
			{/if}
		</div>
	</div>
</main>

