<script>
    let { item } = $props();
</script>

<div
    class="flex justify-between items-center rounded-md border border-black mx-20 my-5 p-5 hover:bg-gray-100"
>
    <div>
        <p><b>Type:</b> {item.type}</p>
        <p><b>Name:</b> {item.name}</p>
        <p><b>Quantity:</b> {item.quantity}</p>
    </div>
    <div class="space-x-5">
        <button class="bg-blue-300 h-10 w-20 rounded-md hover:bg-blue-400"
            >Edit</button
        >
        <button class="bg-red-300 h-10 w-20 rounded-md hover:bg-red-400"
            >Delete</button
        >
    </div>
</div>
