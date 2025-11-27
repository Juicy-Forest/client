<script lang="ts">
    import Map from '$lib/components/Map/Map.svelte';

    let selectedIcon: string | null = null;

    function select(icon: string) {
        selectedIcon = selectedIcon === icon ? null : icon;
    }

    function handlePlaced(e: CustomEvent) {
        console.log('placed', e.detail);
    }
</script>

<svelte:head>
    <link rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" 
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLMDJ8XyY04HwBq2M8oE4hUeL9A5z/Q1qB8JvB6o2M9bA6p2d/A8uA==" 
          crossorigin="anonymous" 
          referrerpolicy="no-referrer" />
</svelte:head>

<div class="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
    <div class="flex flex-col items-center gap-2">
        <h1 class="text-3xl font-bold text-amber-900">Map</h1>
        <p class="text-sm text-amber-700">Select an item and click on the map to place it</p>
    </div>
    
    <div class="rounded-xl overflow-hidden shadow-lg">
        <Map {selectedIcon} on:placed={handlePlaced} />
    </div>

    <div class="flex gap-3 bg-amber-100 rounded-lg p-4 shadow-md border-2 border-amber-200" role="list">
        <button type="button" 
            class:selected={selectedIcon === 'fa-solid fa-fan'} 
            on:click={() => select('fa-solid fa-fan')} 
            aria-label="Fan"
            class="item-btn">
            <i class="fa-solid fa-fan" aria-hidden="true"></i>
            <span class="text-xs mt-1">Fan</span>
        </button>
        <button type="button" 
            class:selected={selectedIcon === 'fa-solid fa-box'} 
            on:click={() => select('fa-solid fa-box')} 
            aria-label="Box"
            class="item-btn">
            <i class="fa-solid fa-box" aria-hidden="true"></i>
            <span class="text-xs mt-1">Box</span>
        </button>
        <button type="button" 
            class:selected={selectedIcon === 'fa-solid fa-heart'} 
            on:click={() => select('fa-solid fa-heart')} 
            aria-label="Heart"
            class="item-btn">
            <i class="fa-solid fa-heart" aria-hidden="true"></i>
            <span class="text-xs mt-1">Heart</span>
        </button>
    </div>
</div>

<style>
    .item-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        background-color: white;
        color: #78350f;
        border-radius: 8px;
        border: 2px solid transparent;
        cursor: pointer;
        font-size: 24px;
        transition: all 200ms;
    }

    .item-btn:hover {
        background-color: #fef3c7;
    }

    .item-btn.selected {
        border-color: #b45309;
        background-color: #fcd34d;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    :global(body) {
        background-color: #faf5f0;
    }
</style>


