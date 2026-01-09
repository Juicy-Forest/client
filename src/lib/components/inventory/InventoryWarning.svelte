<script>
    // @ts-nocheck
    const { inventory } = $props();
    
    const warningItems = $derived(inventory.filter((item) => item.quantity < item.desiredQuantity && item.isImportant === true));

    let isCollapsed = $state(false);

    function toggleCollapse() {
        isCollapsed = !isCollapsed;
    }
</script>

{#if warningItems.length > 0}
    <button
        class="mb-2 text-sm text-red-700 hover:underlinetext-left"
        onclick={toggleCollapse}
    >
        {isCollapsed ? 'Show Low Stock Alert' : 'Hide Low Stock Alert'}
    </button>

    {#if warningItems.length > 0 && !isCollapsed}
        <div class="mb-6 w-full rounded-2xl border border-amber-200/60 bg-linear-to-br from-amber-50 to-orange-50/30 p-5 shadow-sm backdrop-blur-sm">
            <div class="mb-4 flex items-start gap-3">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <i class="fa-solid fa-triangle-exclamation text-sm"></i>
                </div>
                <div class="flex-1">
                    <h3 class="text-sm font-bold text-amber-900">Low Stock Alert</h3>
                    <p class="mt-0.5 text-xs text-amber-700">
                        {warningItems.length} important {warningItems.length === 1 ? 'item' : 'items'} below desired quantity
                    </p>
                </div>
            </div>
            
            <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3 max-h-32 overflow-y-auto">
                {#each warningItems as item}
                    <div class="flex items-center justify-between gap-3 rounded-xl border border-amber-100 bg-white/60 px-4 py-2.5 text-xs backdrop-blur-sm transition-colors hover:bg-white/80">
                        <div class="flex min-w-0 flex-1 items-center gap-2">
                            <span class="truncate font-semibold text-stone-800">{item.name}</span>
                            <span class="shrink-0 text-stone-400">·</span>
                            <span class="shrink-0 text-stone-500">{item.type}</span>
                        </div>
                        <div class="flex shrink-0 items-center gap-2 whitespace-nowrap">
                            <span class="font-medium text-amber-700">
                                {item.quantity}{item.quantityType ? ` ${item.quantityType}` : ''}
                            </span>
                            <span class="text-stone-400">/</span>
                            <span class="text-stone-500">
                                {item.desiredQuantity}{item.quantityType ? ` ${item.quantityType}` : ''}
                            </span>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
{/if}
