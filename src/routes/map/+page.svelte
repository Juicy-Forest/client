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

<div class="my-10 mx-20">
    <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-800">Garden Map</h1>
        <h2 class="text-lg text-gray-500 mt-1">
            Visualize and manage plants in your garden
        </h2>
        <div class="location-badge mt-4">
            <span class="location-icon">📍</span>
            <div class="location-info">
                <p class="location-name">Amsterdam Community Garden</p>
                <p class="location-coords">Amsterdam, Netherlands</p>
            </div>
        </div>
    </div>

    <div class="flex flex-col items-center gap-6">
        <div class="map-wrapper">
            <div class="rounded-xl overflow-hidden shadow-lg">
                <Map {selectedIcon} {isEditMode} on:placed={handlePlaced} />
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
            <p class="text-sm text-gray-600">
                {isEditMode ? 'Select an item and click on the map to place it' : 'Click on items to view details'}
            </p>
        </div>

        {#if isEditMode}
        <div class="flex gap-3 bg-amber-50 rounded-lg p-4 shadow-md border-2 border-amber-200" role="list">
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
</div>

<style>
    .edit-toggle-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background-color: white;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        color: #374151;
        font-weight: 600;
        cursor: pointer;
        transition: all 200ms;
    }

    .edit-toggle-btn:hover {
        background-color: #f3f4f6;
        border-color: #d1d5db;
    }

    .edit-toggle-btn.active {
        background-color: #dbeafe;
        border-color: #3b82f6;
        color: #1e40af;
    }

    .item-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        background-color: white;
        color: #374151;
        border-radius: 8px;
        border: 2px solid #e5e7eb;
        cursor: pointer;
        font-size: 24px;
        transition: all 200ms;
    }

    .item-btn:hover {
        background-color: #f9fafb;
        border-color: #d1d5db;
    }

    .item-btn.selected {
        border-color: #3b82f6;
        background-color: #dbeafe;
        box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.1);
    }

    .location-badge {
        display: flex;
        align-items: center;
        gap: 12px;
        background: #f3f4f6;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .location-icon {
        font-size: 20px;
        line-height: 1;
    }

    .location-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .location-name {
        font-weight: 600;
        color: #1f2937;
        font-size: 14px;
        margin: 0;
    }

    .location-coords {
        font-size: 12px;
        color: #6b7280;
        margin: 0;
    }

    .map-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0;
    }

    :global(body) {
        background-color: #f9fafb;
    }
</style>


