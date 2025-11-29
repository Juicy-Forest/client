<script>
	let { isOpen, close, title, children } = $props();
</script>

{#if isOpen}
	<div class="fixed inset-0 flex justify-center items-center z-50">

		<button 
			class="absolute inset-0 w-full h-full bg-black/50 backdrop-blur-xs cursor-default"
			onclick={close}
			aria-label="Close modal"
			type="button"
		></button>

		<div
			class="relative bg-white rounded-lg shadow-xl p-6 w-96 max-w-full mx-4 transform transition-all"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<div class="flex justify-between items-center mb-6 border-b pb-2">
				<h2 id="modal-title" class="text-xl font-bold text-gray-800">{title}</h2>
				<button 
					onclick={close} 
					class="text-gray-400 hover:text-red-500 transition-colors text-2xl leading-none"
					aria-label="Close modal"
					type="button"
				>
					&times;
				</button>
			</div>

			<div class="mt-2">
				{@render children()}
			</div>
		</div>
	</div>
{/if}