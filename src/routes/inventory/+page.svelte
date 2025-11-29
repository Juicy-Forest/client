<script>
    // @ts-nocheck
	import InventoryItem from '$lib/components/inventory/InventoryItem.svelte';
	import Modal from '$lib/components/util/Modal.svelte';
	import { setContext } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	const selectedInventoryType = $state({ selectedInventoryType: 'all' });
	setContext('selectedInventoryType', selectedInventoryType);

	const filteredItems = $derived(
		selectedInventoryType.selectedInventoryType === 'all'
			? data.inventory
			: data.inventory.filter((item) => item.type === selectedInventoryType.selectedInventoryType)
	);

	let isModalOpen = $state(false);
	let modalMode = $state('create'); // 'create', 'edit', 'delete'
	let selectedItem = $state(null);
	
	let formData = $state({
		name: '',
		type: 'plant',
		quantity: 1,
		quantityType: ''
	});

    const filterOptions = [
        { id: 'all', label: 'All Items', icon: 'fa-layer-group', desc: 'Everything in stock' },
        { id: 'plant', label: 'Plants', icon: 'fa-seedling', desc: 'Living plants' },
        { id: 'seed', label: 'Seeds', icon: 'fa-circle-dot', desc: 'Seeds & bulbs' },
        { id: 'tool', label: 'Tools', icon: 'fa-wrench', desc: 'Garden equipment' },
        { id: 'supply', label: 'Supplies', icon: 'fa-box-open', desc: 'Fertilizer, pots, etc.' }
    ];

	function resetForm() {
		formData = { name: '', type: 'plant', quantity: 1, quantityType: '' };
		selectedItem = null;
	}

	function openCreateModal() {
		resetForm();
		modalMode = 'create';
		isModalOpen = true;
	}

	function openEditModal(item) {
		selectedItem = item;
		formData = {
			name: item.name,
			type: item.type,
			quantity: item.quantity,
			quantityType: item.quantityType || ''
		};
		modalMode = 'edit';
		isModalOpen = true;
	}

	function openDeleteModal(item) {
		selectedItem = item;
		modalMode = 'delete';
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
	}

	async function handleSubmit() {
		const baseUrl = 'http://localhost:3030/inventory/';
		try {
			let response;
			if (modalMode === 'create') {
				response = await fetch(baseUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData)
				});
			} else if (modalMode === 'edit') {
				response = await fetch(`${baseUrl}${selectedItem._id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData)
				});
			} else if (modalMode === 'delete') {
				response = await fetch(`${baseUrl}${selectedItem._id}`, {
					method: 'DELETE'
				});
			}

			if (response.ok) {
				closeModal();
				await invalidateAll(); // refreshes page data
			} else {
                closeModal();
                //need to add a actual error ,essage popup later
			}
		} catch (error) {
			console.error('Network Error', error);
		}
	}
</script>

<section class="box-border min-h-screen bg-[#fdfcf8] px-4 pb-8 pt-12 text-stone-800 sm:px-8 lg:px-12">
  <div class="mx-auto grid w-full max-w-none items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
    
    <!-- Sidebar -->
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
                        <div class={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${selectedInventoryType.selectedInventoryType === option.id ? 'bg-lime-200 text-lime-800' : 'bg-stone-100 text-stone-400 group-hover:bg-white group-hover:text-stone-600'}`}>
                             <i class={`fa-solid ${option.icon}`}></i>
                        </div>
                        <div class="flex flex-col text-left">
                            <span class={`font-semibold ${selectedInventoryType.selectedInventoryType === option.id ? 'text-lime-950' : 'text-stone-700 group-hover:text-stone-900'}`}>
                                {option.label}
                            </span>
                            <span class="text-xs opacity-70 hidden lg:block">{option.desc}</span>
                        </div>
                    </div>
                </button>
            </li>
          {/each}
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-white/80 shadow-xl shadow-stone-200/20 backdrop-blur-xl">
      
      <!-- Header -->
      <header class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-white/50 px-8 py-5 backdrop-blur-sm">
        <div>
            <div class="flex items-center gap-2">
                <h2 class="text-lg font-bold text-stone-800">Garden Inventory</h2>
                <span class="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-bold text-stone-500">{filteredItems.length} items</span>
            </div>
            <p class="mt-0.5 text-sm text-stone-500">Track available plants, seeds, tools and supplies.</p>
        </div>
        <button
            onclick={openCreateModal}
            class="flex items-center gap-2 rounded-xl bg-lime-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-lime-700 hover:shadow-md"
        >
            <i class="fa-solid fa-plus"></i>
            <span>Add Item</span>
        </button>
      </header>

      <!-- List Content -->
      <div class="flex flex-1 flex-col overflow-hidden bg-stone-50/30">
        <div class="flex-1 overflow-y-auto px-8 py-6">
            <div class="flex flex-col gap-2">
                {#each filteredItems as inventoryItem (inventoryItem._id)}
                    <InventoryItem 
                        item={inventoryItem} 
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                    />
                {:else}
                    <div class="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-stone-200 bg-stone-50/50 px-6 py-12 text-center text-sm text-stone-500">
                        <div class="rounded-full bg-stone-100 p-3 text-stone-400">
                            <i class="fa-solid fa-box-open text-xl"></i>
                        </div>
                        <p>No items found in this category.</p>
                    </div>
                {/each}
            </div>
        </div>
      </div>
    </div>
  </div>
</section>

<Modal 
	isOpen={isModalOpen} 
	close={closeModal} 
	title={modalMode === 'delete' ? 'Delete Item' : modalMode === 'create' ? 'Add New Item' : 'Edit Item'}
>
	{#if modalMode === 'delete'}
		<div class="text-center">
            <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <i class="fa-solid fa-trash-can text-lg"></i>
            </div>
			<p class="mb-6 text-stone-600">
				Are you sure you want to delete <strong class="text-stone-900">{selectedItem.name}</strong>? 
				This action cannot be undone.
			</p>
			<div class="flex justify-end gap-3">
				<button 
					onclick={closeModal}
					class="rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
				>
					Cancel
				</button>
				<button 
					onclick={handleSubmit}
					class="rounded-xl bg-red-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-red-600 hover:shadow-md"
				>
					Delete Item
				</button>
			</div>
		</div>

	{:else}
		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-5">
			
			<div>
				<label for="name" class="mb-1.5 block text-sm font-semibold text-stone-700">Name</label>
				<input
					type="text"
					id="name"
					bind:value={formData.name}
					required
					class="w-full rounded-xl border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-lime-300 focus:bg-white focus:ring-2 focus:ring-lime-100 focus:outline-none transition-all"
					placeholder="e.g. Tomato Seeds"
				/>
			</div>

			<div>
				<label for="type" class="mb-1.5 block text-sm font-semibold text-stone-700">Category</label>
                <div class="relative">
                    <select
                        id="type"
                        bind:value={formData.type}
                        class="w-full appearance-none rounded-xl border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 focus:border-lime-300 focus:bg-white focus:ring-2 focus:ring-lime-100 focus:outline-none transition-all"
                    >
                        <option value="plant">Plant</option>
                        <option value="seed">Seed</option>
                        <option value="tool">Tool</option>
                        <option value="supply">Supply</option>
                    </select>
                    <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-xs text-stone-400 pointer-events-none"></i>
                </div>
			</div>

			<div class="flex gap-4">
				<div class="flex-1">
					<label for="quantity" class="mb-1.5 block text-sm font-semibold text-stone-700">Quantity</label>
					<input
						type="number"
						id="quantity"
						min="0"
						bind:value={formData.quantity}
						required
						class="w-full rounded-xl border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-lime-300 focus:bg-white focus:ring-2 focus:ring-lime-100 focus:outline-none transition-all"
					/>
				</div>

				<div class="flex-1">
					<label for="qType" class="mb-1.5 block text-sm font-semibold text-stone-700">Unit <span class="font-normal text-stone-400">(Optional)</span></label>
					<input
						type="text"
						id="qType"
						bind:value={formData.quantityType}
						class="w-full rounded-xl border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-lime-300 focus:bg-white focus:ring-2 focus:ring-lime-100 focus:outline-none transition-all"
						placeholder="e.g. kg, pcs"
					/>
				</div>
			</div>

			<div class="flex justify-end gap-3 pt-2">
				<button 
					type="button" 
					onclick={closeModal}
					class="rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
				>
					Cancel
				</button>
				<button 
					type="submit"
					class="rounded-xl bg-lime-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-lime-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
				>
					{modalMode === 'create' ? 'Add Item' : 'Save Changes'}
				</button>
			</div>
		</form>
	{/if}
</Modal>