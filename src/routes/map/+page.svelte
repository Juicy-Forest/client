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

<div class="map-container">
    <Map {selectedIcon} on:placed={handlePlaced} />
</div>

<div class="item-picker" role="list">
    <button type="button" class:selected={selectedIcon === 'fa-solid fa-fan'} on:click={() => select('fa-solid fa-fan')} aria-label="Fan">
        <i class="fa-solid fa-fan" aria-hidden="true"></i>
    </button>
    <button type="button" class:selected={selectedIcon === 'fa-solid fa-box'} on:click={() => select('fa-solid fa-box')} aria-label="Box">
        <i class="fa-solid fa-box" aria-hidden="true"></i>
    </button>
    <button type="button" class:selected={selectedIcon === 'fa-solid fa-heart'} on:click={() => select('fa-solid fa-heart')} aria-label="Heart">
        <i class="fa-solid fa-heart" aria-hidden="true"></i>
    </button>
</div>

<style>
.map-container {
    display: flex;
    justify-content: center; 
    align-items: center;     
    width: 100%;             
    min-height: calc(100vh - 6rem); 
    padding-top: 3rem;     
    box-sizing: border-box;
}
.item-picker {
    margin: 0 auto;
    display: flex;
    flex-wrap: nowrap;
    background-color: DodgerBlue;
    width: 50%;
    justify-content: center;
}
.item-picker button {
    background-color: #f1f1f1;
    width: 100px;
    margin: 10px;
    padding: 10px;
    text-align: center;  
    font-size: 30px;
    border: none;
    cursor: pointer;
}
.item-picker button.selected {
    outline: 3px solid gold;
    box-shadow: 0 0 6px rgba(0,0,0,0.25);
}
</style>


