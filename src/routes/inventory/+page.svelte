<script>
	import InventoryFilter from "$lib/components/inventory/InventoryFilter.svelte";
	import Modal from "$lib/components/util/Modal.svelte";
	import { setContext } from "svelte";
	import InventoryDeleteModal from "$lib/components/inventory/InventoryDeleteModal.svelte";
	import InventoryCreateEditModal from "$lib/components/inventory/InventoryCreateEditModal.svelte";
	import { inventoryStore } from "$lib/stores/inventoryStore.svelte";
	import InventoryItemList from "$lib/components/inventory/InventoryItemList.svelte";
	import InventoryHeader from "$lib/components/inventory/InventoryHeader.svelte";

	let { data } = $props();

	const selectedInventoryType = $state({ selectedInventoryType: "all" });
	setContext("selectedInventoryType", selectedInventoryType);

	let searchBarInput = $state({value: ""});
	setContext("inventorySearchBarInput", searchBarInput);
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
			<InventoryHeader inventory={data.inventory} />
			<InventoryItemList inventory={data.inventory} />
		</div>
	</div>
</section>

<Modal
	isOpen={inventoryStore.isModalOpen}
	close={inventoryStore.closeModal}
	title={inventoryStore.modalMode === "delete"
		? "Delete Item"
		: inventoryStore.modalMode === "create"
			? "Add New Item"
			: "Edit Item"}
>
	{#if inventoryStore.modalMode === "delete"}
		<InventoryDeleteModal item={inventoryStore.selectedItem} onCancel={inventoryStore.closeModal} onDelete={() => inventoryStore.handleSubmit(data.inventory)} />
	{:else}
	<!-- dont remove the bind here, works without but needed to stop svelte from spamming yellow errors in console -->
		<InventoryCreateEditModal bind:formData={inventoryStore.formData}  errors={inventoryStore.errors} onCancel={inventoryStore.closeModal} onSubmit={() => inventoryStore.handleSubmit(data.inventory)} />
	{/if}
</Modal>
