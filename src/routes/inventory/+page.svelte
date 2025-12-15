<script>
	// @ts-nocheck
	import InventoryItem from "$lib/components/inventory/InventoryItem.svelte";
	import InventoryFilter from "$lib/components/inventory/InventoryFilter.svelte";
	import InventoryWarning from '$lib/components/inventory/InventoryWarning.svelte';
	import Modal from "$lib/components/util/Modal.svelte";
	import { setContext, getContext } from "svelte";
	import { invalidateAll } from "$app/navigation";
	import { slide } from "svelte/transition";
	import InventoryDeleteModal from '$lib/components/inventory/InventoryDeleteModal.svelte';
	import InventoryCreateEditModal from '$lib/components/inventory/InventoryCreateEditModal.svelte';
	import InventorySearchBar from "$lib/components/inventory/InventorySearchBar.svelte";

	let { data } = $props();

	const selectedInventoryType = $state({ selectedInventoryType: "all" });
	setContext("selectedInventoryType", selectedInventoryType);

	const filteredItems = $derived(
		selectedInventoryType.selectedInventoryType === "all"
			? data.inventory
			: data.inventory.filter((item) =>
					selectedInventoryType.selectedInventoryType === true
						? item.isImportant
						: item.type ===
							selectedInventoryType.selectedInventoryType,
				),
	);

	let searchBarInput = $state({value: ""});
	setContext("inventorySearchBarInput", searchBarInput);

	const filteredSearchItems = $derived(
		searchBarInput.value != ""
			? filteredItems.filter((item) => item.name.includes(searchBarInput.value))
			: filteredItems,
	);

	let isModalOpen = $state(false);
	let modalMode = $state("create");
	let selectedItem = $state(null);
	let errors = $state({}); // Track validation errors

	let formData = $state({
		name: "",
		type: "plant",
		quantity: 1,
		quantityType: "",
		isImportant: false,
		desiredQuantity: 0,
	});

	function resetForm() {
		formData = {
			name: "",
			type: "plant",
			quantity: 1,
			quantityType: "",
			isImportant: false,
			desiredQuantity: 0,
		};
		selectedItem = null;
		errors = {};
	}

	function openCreateModal() {
		resetForm();
		modalMode = "create";
		isModalOpen = true;
	}

	function openEditModal(item) {
		selectedItem = item;
		formData = {
			name: item.name,
			type: item.type,
			quantity: item.quantity,
			quantityType: item.quantityType || "",
			isImportant: item.isImportant || false,
			desiredQuantity: item.desiredQuantity || 0,
		};
		errors = {};
		modalMode = "edit";
		isModalOpen = true;
	}

	function openDeleteModal(item) {
		selectedItem = item;
		modalMode = "delete";
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		errors = {};
	}

	function validateForm() {
		const newErrors = {};
		let isValid = true;

		const duplicate = data.inventory.find(
			(item) =>
				item.name.toLowerCase() ===
					formData.name.trim().toLowerCase() &&
				(modalMode === "create" || item._id !== selectedItem._id),
		);

		if (!formData.name.trim()) {
			newErrors.name = "Name is required.";
			isValid = false;
		} else if (duplicate) {
			newErrors.name = "An item with this name already exists.";
			isValid = false;
		}

		if (
			formData.quantity === null ||
			formData.quantity === "" ||
			formData.quantity < 0
		) {
			newErrors.quantity = "Quantity must be 0 or higher.";
			isValid = false;
		}

		if (formData.isImportant) {
			if (
				formData.desiredQuantity === null ||
				formData.desiredQuantity === "" ||
				formData.desiredQuantity < 0
			) {
				newErrors.desiredQuantity = "Required when marked important.";
				isValid = false;
			}
		}

		errors = newErrors;
		return isValid;
	}

	async function handleSubmit() {
		if (modalMode !== "delete" && !validateForm()) {
			return;
		}

		const baseUrl = "http://localhost:3030/inventory/";
		try {
			let response;
			if (modalMode === "create") {
				response = await fetch(baseUrl, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});
			} else if (modalMode === "edit") {
				response = await fetch(`${baseUrl}${selectedItem._id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});
			} else if (modalMode === "delete") {
				response = await fetch(`${baseUrl}${selectedItem._id}`, {
					method: "DELETE",
				});
			}

			if (response.ok) {
				closeModal();
				await invalidateAll();
			} else {
				const result = await response.json();
				console.error("Server Error:", result);
			}
		} catch (error) {
			console.error("Network Error", error);
		}
	}
</script>

<section
	class="box-border min-h-screen bg-[#fdfcf8] px-4 pb-8 pt-12 text-stone-800 sm:px-8 lg:px-12"
>
	<div
		class="mx-auto grid w-full max-w-none items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]"
	>
		<InventoryFilter />

		<div
			class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-white/80 shadow-xl shadow-stone-200/20 backdrop-blur-xl"
		>
			<header
				class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-white/50 px-8 py-5 backdrop-blur-sm"
			>
				<div class="w-full">
					<InventoryWarning inventory={data.inventory} />
				</div>
				<div>
					<div class="flex items-center gap-2">
						<h2 class="text-lg font-bold text-stone-800">
							Garden Inventory
						</h2>
						<span
							class="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-bold text-stone-500"
							>{data.inventory ? data.inventory.length : 0} items</span
						>
					</div>
					<p class="mt-0.5 text-sm text-stone-500">
						Track available plants, seeds, tools and supplies.
					</p>
				</div>
				<button
					onclick={openCreateModal}
					class="flex items-center gap-2 rounded-xl bg-lime-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-lime-700 hover:shadow-md"
				>
					<i class="fa-solid fa-plus"></i>
					<span>Add Item</span>
				</button>
				<InventorySearchBar />
			</header>

			<div class="flex flex-1 flex-col overflow-hidden bg-stone-50/30">
				<div class="flex-1 overflow-y-auto px-8 py-6">
					<div class="flex flex-col gap-2">
						{#each filteredSearchItems as inventoryItem (inventoryItem._id)}
							<InventoryItem
								item={inventoryItem}
								onEdit={openEditModal}
								onDelete={openDeleteModal}
							/>
						{:else}
							<div
								class="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-stone-200 bg-stone-50/50 px-6 py-12 text-center text-sm text-stone-500"
							>
								<div
									class="rounded-full bg-stone-100 p-3 text-stone-400"
								>
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
	title={modalMode === "delete"
		? "Delete Item"
		: modalMode === "create"
			? "Add New Item"
			: "Edit Item"}
>
	{#if modalMode === "delete"}
		<InventoryDeleteModal item={selectedItem} onCancel={closeModal} onDelete={handleSubmit}/>
	{:else}
		<InventoryCreateEditModal formData={formData} errors={errors} onCancel={closeModal} onSubmit={handleSubmit} />
	{/if}
</Modal>
