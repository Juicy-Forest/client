<script>
    import { getContext } from "svelte";

    let selectedInventoryType = getContext("selectedInventoryType");

    const buttonValues = [
        {onclickType: "all", buttonText: "All items"},
        {onclickType: "plant", buttonText: "Plants"},
        {onclickType: "seed", buttonText: "Seeds"},
        {onclickType: "tool", buttonText: "Tools"},
        {onclickType: "supply", buttonText: "Supplies"},
    ]
</script>

<div class="flex justify-around bg-gray-200 mx-20 h-10 rounded-md">
    {#each buttonValues as buttonValue}
    <button
        onclick={() => (selectedInventoryType.selectedInventoryType = buttonValue.onclickType)}
        class="hover:cursor-pointer w-35 h-full">{buttonValue.buttonText}</button
    >
    {/each}
</div>
