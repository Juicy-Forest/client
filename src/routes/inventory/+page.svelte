<script>
    import InventoryItem from '$lib/components/inventory/InventoryItem.svelte';
    import InventoryFilter from '$lib/components/inventory/InventoryFilter.svelte';
    import { setContext } from 'svelte';

    let { data } = $props();

    const selectedInventoryType = $state({selectedInventoryType: "all"});
    setContext("selectedInventoryType", selectedInventoryType);

    const filteredItems = $derived(selectedInventoryType.selectedInventoryType === "all" ? data.inventory : data.inventory.filter((item) => item.type === selectedInventoryType.selectedInventoryType));
</script>

<div class="my-10 mx-20 flex justify-between">
    <div>
        <h1 class="text-3xl">Garden inventory</h1>
        <h2 class="text-lg text-gray-400">
            Track available plants, seeds, tools and supplies
        </h2>
    </div>
    <button class="bg-green-300 rounded-lg mt-5 h-10 w-30 text-white hover:bg-green-400"
        ><span class="mr-3">+</span> Add item</button
    >
</div>

<InventoryFilter />

{#each filteredItems as inventoryItem}
    <InventoryItem item = {inventoryItem} />
{/each}