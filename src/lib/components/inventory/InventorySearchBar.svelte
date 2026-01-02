<script>
    import { getContext } from 'svelte';

    let inventorySearchBarInput = getContext("inventorySearchBarInput");
</script>

<input bind:value={inventorySearchBarInput.value} placeholder="Search for items" class="w-full h-10">