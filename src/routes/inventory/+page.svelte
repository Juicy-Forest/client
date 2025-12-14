<script>
	// @ts-nocheck
	import InventoryItem from "$lib/components/inventory/InventoryItem.svelte";
	import InventoryFilter from "$lib/components/inventory/InventoryFilter.svelte";
	import InventoryWarning from '$lib/components/inventory/InventoryWarning.svelte';
	import Modal from "$lib/components/util/Modal.svelte";
	import { setContext, getContext } from "svelte";
	import { invalidateAll } from "$app/navigation";
	import { slide } from "svelte/transition";

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
			</header>

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
		<div class="text-center">
			<div
				class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600"
			>
				<i class="fa-solid fa-trash-can text-lg"></i>
			</div>
			<p class="mb-6 text-stone-600">
				Are you sure you want to delete <strong class="text-stone-900"
					>{selectedItem.name}</strong
				>? This action cannot be undone.
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
		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			class="space-y-5"
		>
			<div>
				<label
					for="name"
					class="mb-1.5 block text-sm font-semibold text-stone-700"
					>Name</label
				>
				<input
					type="text"
					id="name"
					bind:value={formData.name}
					class={`w-full rounded-xl border bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
						errors.name
							? "border-red-300 focus:border-red-400 focus:ring-red-100"
							: "border-stone-200 focus:border-lime-300 focus:ring-lime-100"
					}`}
					placeholder="e.g. Tomato Seeds"
				/>
				{#if errors.name}
					<p class="mt-1 text-xs text-red-500" transition:slide>
						{errors.name}
					</p>
				{/if}
			</div>

			<div>
				<label
					for="type"
					class="mb-1.5 block text-sm font-semibold text-stone-700"
					>Category</label
				>
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
					<i
						class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-xs text-stone-400 pointer-events-none"
					></i>
				</div>
			</div>

			<div class="flex gap-4">
				<div class="flex-1">
					<label
						for="quantity"
						class="mb-1.5 block text-sm font-semibold text-stone-700"
						>Quantity</label
					>
					<input
						type="number"
						id="quantity"
						min=0
						bind:value={formData.quantity}
						class={`w-full rounded-xl border bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
							errors.quantity
								? "border-red-300 focus:border-red-400 focus:ring-red-100"
								: "border-stone-200 focus:border-lime-300 focus:ring-lime-100"
						}`}
					/>
					{#if errors.quantity}
						<p class="mt-1 text-xs text-red-500" transition:slide>
							{errors.quantity}
						</p>
					{/if}
				</div>

				<div class="flex-1">
					<label
						for="quantityType"
						class="mb-1.5 block text-sm font-semibold text-stone-700"
						>Unit <span class="font-normal text-stone-400"
							>(Optional)</span
						></label
					>
					<input
						type="text"
						id="quantityType"
						bind:value={formData.quantityType}
						class="w-full rounded-xl border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-lime-300 focus:bg-white focus:ring-2 focus:ring-lime-100 focus:outline-none transition-all"
						placeholder="e.g. kg, pcs"
					/>
				</div>
			</div>

			<div
				class="rounded-2xl border border-stone-100 bg-stone-50 p-4 transition-colors focus-within:border-lime-200 focus-within:bg-lime-50/30"
			>
				<div class="flex flex-wrap items-center gap-6">
					<div class="flex items-center gap-3">
						<div class="flex items-center h-6">
							<input
								id="isImportant"
								type="checkbox"
								bind:checked={formData.isImportant}
								class="h-5 w-5 rounded-md border-stone-300 text-lime-600 focus:ring-lime-500 transition-all cursor-pointer"
							/>
						</div>
						<div class="text-sm">
							<label
								for="isImportant"
								class="font-medium text-stone-700 cursor-pointer"
								>Mark important</label
							>
						</div>

						<div
							class="group relative flex cursor-help items-center justify-center text-stone-400 transition-colors hover:text-lime-600"
						>
							<i class="fa-solid fa-circle-question text-base"
							></i>
							<div
								class="pointer-events-none absolute bottom-full left-1/2 mb-3 w-56 -translate-x-1/2 rounded-xl bg-stone-800 p-3 text-xs leading-relaxed text-white opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100 z-50"
							>
								Items marked as important will display
								notifications when their available quantity
								drops below the set desired quantity.
								<div
									class="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-stone-800"
								></div>
							</div>
						</div>
					</div>

					{#if formData.isImportant}
						<div
							class="flex-1 min-w-[120px]"
							transition:slide={{ axis: "x", duration: 300 }}
						>
							<div class="flex flex-col">
								<div class="flex items-center gap-2">
									<label
										for="desiredQuantity"
										class="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-stone-500"
										>Desired Qty</label
									>
									<input
										type="number"
										id="desiredQuantity"
										min="0"
										bind:value={formData.desiredQuantity}
										class={`w-full rounded-lg border bg-white px-3 py-1.5 text-sm text-stone-800 focus:outline-none focus:ring-2 ${
											errors.desiredQuantity
												? "border-red-300 focus:border-red-400 focus:ring-red-100"
												: "border-stone-200 focus:border-lime-300 focus:ring-lime-100"
										}`}
									/>
								</div>
								{#if errors.desiredQuantity}
									<p
										class="mt-1 text-right text-xs text-red-500"
										transition:slide
									>
										{errors.desiredQuantity}
									</p>
								{/if}
							</div>
						</div>
					{/if}
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
					{modalMode === "create" ? "Add Item" : "Save Changes"}
				</button>
			</div>
		</form>
	{/if}
</Modal>
