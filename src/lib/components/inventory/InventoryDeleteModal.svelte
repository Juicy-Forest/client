<script>
    const {item, onCancel, onDelete} = $props();
</script>

		<div class="text-center">
			<div
				class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600"
			>
				<i class="fa-solid fa-trash-can text-lg"></i>
			</div>
			<p class="mb-6 text-stone-600">
				Are you sure you want to delete <strong class="text-stone-900"
					>{item.name}</strong
				>? This action cannot be undone.
			</p>
			<div class="flex justify-end gap-3">
				<button
					onclick={onCancel}
					class="rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
				>
					Cancel
				</button>
				<button
					onclick={onDelete}
					class="rounded-xl bg-red-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-red-600 hover:shadow-md"
				>
					Delete Item
				</button>
			</div>
		</div>