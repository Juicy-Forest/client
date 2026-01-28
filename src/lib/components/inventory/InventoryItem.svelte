<script>
    const { item, onEdit, onDelete } = $props();
    
    const typeIcons = {
        plant: 'fa-seedling',
        seed: 'fa-circle-dot',
        tool: 'fa-wrench',
        supply: 'fa-box-open'
    };
    
    const typeColors = {
        plant: 'bg-emerald-100 text-emerald-700',
        seed: 'bg-amber-100 text-amber-700',
        tool: 'bg-sky-100 text-sky-700',
        supply: 'bg-violet-100 text-violet-700'
    };
</script>

<div class="group flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3 transition-all hover:bg-stone-50/80 hover:border-stone-300">
    <div class="flex items-center gap-4">
        <div class={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${typeColors[item.type] || 'bg-stone-100 text-stone-600'}`}>
            <i class={`fa-solid ${typeIcons[item.type] || 'fa-box'} text-sm`}></i>
        </div>
        <div class="min-w-0">
            <div class="flex items-center gap-2">
                <h3 class="font-semibold text-stone-800">{item.name}</h3>
                {#if item.isImportant}
                    <span class="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        <i class="fa-solid fa-star text-[8px]"></i>
                        Important
                    </span>
                {/if}
            </div>
            <div class="flex items-center gap-3 mt-0.5">
                <span class={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${typeColors[item.type] || 'bg-stone-100 text-stone-600'}`}>
                    {item.type}
                </span>
                <p class="text-xs text-stone-500">
                    Qty: <span class="font-semibold text-stone-700">{item.quantity}</span>
                    {#if item.quantityType}
                        <span class="text-stone-400">{item.quantityType}</span>
                    {/if}
                </p>
            </div>
        </div>
    </div>
    
    <div class="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button 
            onclick={() => onEdit(item)}
            class="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-blue-100 hover:text-blue-600"
            aria-label="Edit item"
        >
            <i class="fa-solid fa-pen-to-square text-sm"></i>
        </button>
        <button 
            onclick={() => onDelete(item)}
            class="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-red-100 hover:text-red-600"
            aria-label="Delete item"
        >
            <i class="fa-solid fa-trash-can text-sm"></i>
        </button>
    </div>
</div>
