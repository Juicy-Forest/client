<script>
    import Map from '$lib/components/Map/Map.svelte';
</script>
<div class="map-container">
    <Map/>
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
</style>
