<script>
	import { getContext } from 'svelte';

	let selectedInventoryType = getContext('selectedInventoryType');

	const filterOptions = [
		{ id: 'all', label: 'All Items', icon: 'fa-layer-group', desc: 'Everything in stock' },
		{ id: true, label: 'Important items', icon: 'fa-star', desc: 'Items marked important' },
		{ id: 'plant', label: 'Plants', icon: 'fa-seedling', desc: 'Living plants' },
		{ id: 'seed', label: 'Seeds', icon: 'fa-circle-dot', desc: 'Seeds & bulbs' },
		{ id: 'tool', label: 'Tools', icon: 'fa-wrench', desc: 'Garden equipment' },
		{ id: 'supply', label: 'Supplies', icon: 'fa-box-open', desc: 'Fertilizer, Soil, Pesticide' }
	];
</script>

<aside class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-3xl border border-stone-200/60 bg-white/60 px-5 py-6 shadow-sm backdrop-blur-xl transition-colors hover:bg-white/80">
	<header class="mb-6 px-2">
		<p class="text-xs font-bold uppercase tracking-widest text-stone-400">Inventory</p>
		<h1 class="mt-1 text-lg font-bold tracking-tight text-stone-800">Categories</h1>
	</header>

	<nav class="flex-1 overflow-y-auto pr-1">
		<ul class="space-y-2">
			{#each filterOptions as option}
				<li>
					<button
						class={`group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${
							selectedInventoryType.selectedInventoryType === option.id
								? 'bg-lime-100/50 text-lime-900 shadow-sm ring-1 ring-lime-200/50'
								: 'text-stone-500 hover:bg-stone-100/50 hover:text-stone-700'
						}`}
						onclick={() => (selectedInventoryType.selectedInventoryType = option.id)}
					>
						<div class="flex items-center gap-3">
							<div
								class={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
									selectedInventoryType.selectedInventoryType === option.id
										? 'bg-lime-200 text-lime-800'
										: 'bg-stone-100 text-stone-400 group-hover:bg-white group-hover:text-stone-600'
								}`}
							>
								<i class={`fa-solid ${option.icon}`}></i>
							</div>
							<div class="flex flex-col text-left">
								<span
									class={`font-semibold ${
										selectedInventoryType.selectedInventoryType === option.id
											? 'text-lime-950'
											: 'text-stone-700 group-hover:text-stone-900'
									}`}
								>
									{option.label}
								</span>
								<span class="hidden text-xs opacity-70 lg:block">{option.desc}</span>
							</div>
						</div>
					</button>
				</li>
			{/each}
		</ul>
	</nav>
</aside>