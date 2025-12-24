<script>
    let { item, onEdit, onDelete } = $props();
</script>

<div class="flex justify-between items-center rounded-md border border-gray-300 shadow-md mx-20 my-5 p-5 hover:bg-gray-50">
	<div>
		<div class="flex items-center gap-2 mb-1">
			<span class="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded uppercase font-bold">
				{item.isImportant ? "⭐ " + item.type : item.type}
			</span>
		</div>
		<h3 class="text-lg font-semibold text-gray-800">{item.name}</h3>
		<p class="text-gray-600 text-sm mt-1">
			Quantity: <span class="font-medium text-black">{item.quantity} {item.quantityType || ''}</span>
		</p>
	</div>
	
	<div class="space-x-3">
		<button 
			onclick={() => onEdit(item)}
			class="bg-blue-100 text-blue-700 h-10 px-4 rounded-md hover:bg-blue-200 font-medium shadow-sm"
		>
			Edit
		</button>
		<button 
			onclick={() => onDelete(item)}
			class="bg-red-100 text-red-700 h-10 px-4 rounded-md hover:bg-red-200 font-medium shadow-sm"
		>
			Delete
		</button>
	</div>
</div>
