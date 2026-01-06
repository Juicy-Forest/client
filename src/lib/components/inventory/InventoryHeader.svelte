<script>
    import InventoryWarning from "./InventoryWarning.svelte";
    import InventorySearchBar from "./InventorySearchBar.svelte";
    import { inventoryStore } from "$lib/stores/inventoryStore.svelte";

    const { inventory } = $props();
</script>

<header
    class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-white/50 px-8 py-5 backdrop-blur-sm"
>
    <div class="w-full">
        <InventoryWarning {inventory} />
    </div>
    <div>
        <div class="flex items-center gap-2">
            <h2 class="text-lg font-bold text-stone-800">Garden Inventory</h2>
            <span
                class="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-bold text-stone-500"
                >{inventory ? inventory.length : 0} items</span
            >
        </div>
        <p class="mt-0.5 text-sm text-stone-500">
            Track available plants, seeds, tools and supplies.
        </p>
    </div>
    <button
        onclick={inventoryStore.openCreateModal}
        class="flex items-center gap-2 rounded-xl bg-lime-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-lime-700 hover:shadow-md"
    >
        <i class="fa-solid fa-plus"></i>
        <span>Add Item</span>
    </button>
    <InventorySearchBar />
</header>
