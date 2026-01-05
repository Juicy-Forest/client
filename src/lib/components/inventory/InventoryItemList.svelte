<script>
    import { inventoryStore } from '$lib/stores/inventoryStore.svelte';
    import { getContext } from 'svelte';
    import InventoryItem from './InventoryItem.svelte';

    const { inventory } = $props();
    
    const selectedInventoryType = getContext("selectedInventoryType");
    const searchBarInput = getContext("inventorySearchBarInput")
    
    const filteredItems = $derived(
        selectedInventoryType.selectedInventoryType === "all"
            ? inventory
            : inventory.filter((item) =>
                    selectedInventoryType.selectedInventoryType === true
                        ? item.isImportant
                        : item.type === 
							selectedInventoryType.selectedInventoryType,
                ),
    );

        const filteredSearchItems = $derived(
        searchBarInput.value != ""
            ? filteredItems.filter((item) => item.name.includes(searchBarInput.value))
            : filteredItems,
    );

</script>

<div class="flex flex-1 flex-col overflow-hidden bg-stone-50/30">
    <div class="flex-1 overflow-y-auto px-8 py-6">
        <div class="flex flex-col gap-2">
            {#each filteredSearchItems as inventoryItem (inventoryItem._id)}
                <InventoryItem
                    item={inventoryItem}
                    onEdit={inventoryStore.openEditModal}
                    onDelete={inventoryStore.openDeleteModal}
                />
            {:else}
                <div
                    class="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-stone-200 bg-stone-50/50 px-6 py-12 text-center text-sm text-stone-500"
                >
                    <div class="rounded-full bg-stone-100 p-3 text-stone-400">
                        <i class="fa-solid fa-box-open text-xl"></i>
                    </div>
                    <p>No items found in this category.</p>
                </div>
            {/each}
        </div>
    </div>
</div>
