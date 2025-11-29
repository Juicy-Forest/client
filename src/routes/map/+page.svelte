<script lang="ts">
    import Map from '$lib/components/Map/Map.svelte';

    let selectedIcon: string | null = null;
    let isEditMode = false;

    function select(icon: string) {
        selectedIcon = selectedIcon === icon ? null : icon;
    }

    function toggleEditMode() {
        isEditMode = !isEditMode;
        selectedIcon = null; 
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
    <div class="flex flex-col items-center gap-4">
        <h1 class="text-3xl font-bold text-amber-900">Map</h1>
        <div class="location-badge">
            <span class="location-icon">📍</span>
            <div class="location-info">
                <p class="location-name">Amsterdam Community Garden</p>
                <p class="location-coords">Amsterdam, Netherlands</p>
            </div>
        </div>
    </div>
    
    <div class="map-wrapper">
        <div class="map-container">
            <div class="rounded-xl overflow-hidden shadow-lg">
                <Map {selectedIcon} {isEditMode} on:placed={handlePlaced} />
            </div>
        </div>
    </div>

    <div class="flex flex-col items-center gap-3">
        <button
            on:click={toggleEditMode}
            class:active={isEditMode}
            class="edit-toggle-btn"
            aria-label="Toggle edit mode"
        >
            <i class="fa-solid fa-pen"></i>
            <span>{isEditMode ? 'View Mode' : 'Edit Mode'}</span>
        </button>
        <p class="text-sm text-amber-700">
            {isEditMode ? 'Select an item and click on the map to place it' : 'Drag to explore the map'}
        </p>
    </div>

    {#if isEditMode}
    <div class="flex gap-3 bg-amber-100 rounded-lg p-4 shadow-md border-2 border-amber-200" role="list">
        <button type="button" 
            class:selected={selectedIcon === 'water'} 
            on:click={() => select('water')} 
            aria-label="Water"
            class="item-btn">
            <span class="text-4xl">💧</span>
            <span class="text-xs mt-1">Water</span>
        </button>
        <button type="button" 
            class:selected={selectedIcon === 'plant'} 
            on:click={() => select('plant')} 
            aria-label="Plant"
            class="item-btn">
            <span class="text-4xl">🌱</span>
            <span class="text-xs mt-1">Plant</span>
        </button>
        <button type="button" 
            class:selected={selectedIcon === 'plants'} 
            on:click={() => select('plants')} 
            aria-label="Plants Group"
            class="item-btn">
            <span class="text-4xl">🌿</span>
            <span class="text-xs mt-1">Plants</span>
        </button>
        <button type="button" 
            class:selected={selectedIcon === 'bush'} 
            on:click={() => select('bush')} 
            aria-label="Bush"
            class="item-btn">
            <span class="text-4xl">🌾</span>
            <span class="text-xs mt-1">Bush</span>
        </button>
        <button type="button" 
            class:selected={selectedIcon === 'tree'} 
            on:click={() => select('tree')} 
            aria-label="Tree"
            class="item-btn">
            <span class="text-4xl">🌳</span>
            <span class="text-xs mt-1">Tree</span>
        </button>
    </div>
    {/if}
</div>

<style>
    .edit-toggle-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background-color: white;
        border: 2px solid #b45309;
        border-radius: 8px;
        color: #b45309;
        font-weight: 600;
        cursor: pointer;
        transition: all 200ms;
    }

    .edit-toggle-btn:hover {
        background-color: #fef3c7;
    }

    .edit-toggle-btn.active {
        background-color: #fcd34d;
        border-color: #92400e;
        color: #92400e;
    }

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

    .location-badge {
        display: flex;
        align-items: center;
        gap: 12px;
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border: 2px solid #b45309;
        border-radius: 12px;
        padding: 12px 20px;
        box-shadow: 0 4px 12px rgba(180, 83, 9, 0.15);
    }

    .location-icon {
        font-size: 24px;
        line-height: 1;
    }

    .location-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .location-name {
        font-weight: 700;
        color: #92400e;
        font-size: 14px;
        margin: 0;
    }

    .location-coords {
        font-size: 12px;
        color: #b45309;
        margin: 0;
    }

    .map-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0;
    }

    .map-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    :global(body) {
        background-color: #faf5f0;
    }
</style>


