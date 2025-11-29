<script>
	let { isOpen, close, title, children } = $props();
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-0">
		<div 
			class="fixed inset-0 transition-opacity"
			aria-hidden="true"
		>
			<div class="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onclick={close}></div>
		</div>

		<div
			class="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-all sm:w-full"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
            <div class="mb-6 flex items-center justify-between">
                <h2 id="modal-title" class="text-xl font-bold text-stone-800">{title}</h2>
                <button 
                    onclick={close} 
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors hover:bg-stone-200 hover:text-stone-700"
                    aria-label="Close modal"
                    type="button"
                >
                    <i class="fa-solid fa-xmark text-sm"></i>
                </button>
            </div>

			<div>
				{@render children()}
			</div>
		</div>
	</div>
{/if}