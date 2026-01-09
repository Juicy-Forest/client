<script>
    import { getContext } from 'svelte';

    let inventorySearchBarInput = getContext("inventorySearchBarInput");
</script>

<div class="relative w-full max-w-xs">
    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <i class="fa-solid fa-magnifying-glass text-stone-400 text-sm"></i>
    </div>
    <input 
        bind:value={inventorySearchBarInput.value} 
        placeholder="Search items..." 
        class="w-full rounded-xl border border-stone-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-stone-800 placeholder-stone-400 transition-all focus:border-lime-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime-500/20"
    />
    {#if inventorySearchBarInput.value}
        <button 
            onclick={() => inventorySearchBarInput.value = ''}
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-600 transition-colors"
            aria-label="Clear search"
        >
            <i class="fa-solid fa-xmark text-sm"></i>
        </button>
    {/if}
</div>