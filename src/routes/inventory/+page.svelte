<script>
    // @ts-nocheck -> theres a bunch of fodder "errors" about things being possibly null or being any type,
    // doesn't break any code, just gotta look into fixing that later
	import InventoryItem from '$lib/components/inventory/InventoryItem.svelte';
	import InventoryFilter from '$lib/components/inventory/InventoryFilter.svelte';
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

<div class="my-10 mx-20 flex justify-between items-end">
	<div>
		<h1 class="text-3xl font-bold text-gray-800">Garden inventory</h1>
		<h2 class="text-lg text-gray-500 mt-1">
			Track available plants, seeds, tools and supplies
		</h2>
	</div>
	<button
		onclick={openCreateModal}
        class="bg-green-200 rounded-lg mt-5 h-10 w-30 text-green-700 hover:bg-green-300 font-medium shadow-sm"
	>
		<span class="mr-2 text-xl leading-none">+</span> Add item
	</button>
</div>

<InventoryFilter />

<div class="mt-6">
	{#each filteredItems as inventoryItem (inventoryItem._id)}
		<InventoryItem 
			item={inventoryItem} 
			onEdit={openEditModal}
			onDelete={openDeleteModal}
		/>
	{:else}
		<div class="text-center text-gray-500 mt-10">
			No items found.
		</div>
	{/each}
</div>

<Modal 
	isOpen={isModalOpen} 
	close={closeModal} 
	title={modalMode === 'delete' ? 'Delete Item' : modalMode === 'create' ? 'Add New Item' : 'Edit Item'}
>
	{#if modalMode === 'delete'}
		<div class="text-center">
			<p class="text-gray-600 mb-6">
				Are you sure you want to delete <strong class="text-black">{selectedItem.name}</strong>? 
				This action cannot be undone.
			</p>
			<div class="flex justify-end gap-3">
				<button 
					onclick={closeModal}
					class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
				>
					Cancel
				</button>
				<button 
					onclick={handleSubmit}
					class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
				>
					Delete
				</button>
			</div>
		</div>

	{:else}
		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
			
			<div>
				<label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
				<input
					type="text"
					id="name"
					bind:value={formData.name}
					required
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
					placeholder="e.g. Tomato Seeds"
				/>
			</div>

			<div>
				<label for="type" class="block text-sm font-medium text-gray-700 mb-1">Type</label>
				<select
					id="type"
					bind:value={formData.type}
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
				>
					<option value="plant">Plant</option>
					<option value="seed">Seed</option>
					<option value="tool">Tool</option>
					<option value="supply">Supply</option>
				</select>
			</div>

			<div class="flex gap-4">
				<div class="flex-1">
					<label for="quantity" class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
					<input
						type="number"
						id="quantity"
						min="0"
						bind:value={formData.quantity}
						required
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
					/>
				</div>

				<div class="flex-1">
					<label for="qType" class="block text-sm font-medium text-gray-700 mb-1">Unit (Optional)</label>
					<input
						type="text"
						id="qType"
						bind:value={formData.quantityType}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
						placeholder="e.g. kg, pcs"
					/>
				</div>
			</div>

			<div class="flex justify-end gap-3 pt-2">
				<button 
					type="button" 
					onclick={closeModal}
					class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
				>
					Cancel
				</button>
				<button 
					type="submit"
					class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium"
				>
					{modalMode === 'create' ? 'Create' : 'Save Changes'}
				</button>
			</div>
		</form>
	{/if}
</Modal>