<script>
    const { formData = $bindable(), errors, onCancel, onSubmit } = $props();
</script>

<form
    onsubmit={(e) => {
        e.preventDefault();
        onSubmit();
    }}
    class="space-y-5"
>
    <div>
        <label
            for="name"
            class="mb-1.5 block text-sm font-semibold text-stone-700"
            >Name</label
        >
        <input
            type="text"
            id="name"
            bind:value={formData.name}
            class={`w-full rounded-xl border bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.name
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-stone-200 focus:border-lime-300 focus:ring-lime-100"
            }`}
            placeholder="e.g. Tomato Seeds"
        />
        {#if errors.name}
            <p class="mt-1 text-xs text-red-500">
                {errors.name}
            </p>
        {/if}
    </div>

    <div>
        <label
            for="type"
            class="mb-1.5 block text-sm font-semibold text-stone-700"
            >Category</label
        >
        <div class="relative">
            <select
                id="type"
                bind:value={formData.type}
                class="w-full appearance-none rounded-xl border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 focus:border-lime-300 focus:bg-white focus:ring-2 focus:ring-lime-100 focus:outline-none transition-all"
            >
                <option value="plant">Plant</option>
                <option value="seed">Seed</option>
                <option value="tool">Tool</option>
                <option value="supply">Supply</option>
            </select>
            <i
                class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-xs text-stone-400 pointer-events-none"
            ></i>
        </div>
    </div>

    <div class="flex gap-4">
        <div class="flex-1">
            <label
                for="quantity"
                class="mb-1.5 block text-sm font-semibold text-stone-700"
                >Quantity</label
            >
            <input
                type="number"
                id="quantity"
                min="0"
                bind:value={formData.quantity}
                class={`w-full rounded-xl border bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.quantity
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-stone-200 focus:border-lime-300 focus:ring-lime-100"
                }`}
            />
            {#if errors.quantity}
                <p class="mt-1 text-xs text-red-500">
                    {errors.quantity}
                </p>
            {/if}
        </div>

        <div class="flex-1">
            <label
                for="quantityType"
                class="mb-1.5 block text-sm font-semibold text-stone-700"
                >Unit <span class="font-normal text-stone-400">(Optional)</span
                ></label
            >
            <input
                type="text"
                id="quantityType"
                bind:value={formData.quantityType}
                class="w-full rounded-xl border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-lime-300 focus:bg-white focus:ring-2 focus:ring-lime-100 focus:outline-none transition-all"
                placeholder="e.g. kg, pcs"
            />
        </div>
    </div>

    <div
        class="rounded-2xl border border-stone-100 bg-stone-50 p-4 transition-colors focus-within:border-lime-200 focus-within:bg-lime-50/30"
    >
        <div class="flex flex-wrap items-center gap-6">
            <div class="flex items-center gap-3">
                <div class="flex items-center h-6">
                    <input
                        id="isImportant"
                        type="checkbox"
                        bind:checked={formData.isImportant}
                        class="h-5 w-5 rounded-md border-stone-300 text-lime-600 focus:ring-lime-500 transition-all cursor-pointer"
                    />
                </div>
                <div class="text-sm">
                    <label
                        for="isImportant"
                        class="font-medium text-stone-700 cursor-pointer"
                        >Mark important</label
                    >
                </div>

                <div
                    class="group relative flex cursor-help items-center justify-center text-stone-400 transition-colors hover:text-lime-600"
                >
                    <i class="fa-solid fa-circle-question text-base"></i>
                    <div
                        class="pointer-events-none absolute bottom-full left-1/2 mb-3 w-56 -translate-x-1/2 rounded-xl bg-stone-800 p-3 text-xs leading-relaxed text-white opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100 z-50"
                    >
                        Items marked as important will display notifications
                        when their available quantity drops below the set
                        desired quantity.
                        <div
                            class="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-stone-800"
                        ></div>
                    </div>
                </div>
            </div>

            {#if formData.isImportant}
                <div class="flex-1 min-w-[120px]">
                    <div class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <label
                                for="desiredQuantity"
                                class="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-stone-500"
                                >Desired Qty</label
                            >
                            <input
                                type="number"
                                id="desiredQuantity"
                                min="0"
                                bind:value={formData.desiredQuantity}
                                class={`w-full rounded-lg border bg-white px-3 py-1.5 text-sm text-stone-800 focus:outline-none focus:ring-2 ${
                                    errors.desiredQuantity
                                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                        : "border-stone-200 focus:border-lime-300 focus:ring-lime-100"
                                }`}
                            />
                        </div>
                        {#if errors.desiredQuantity}
                            <p class="mt-1 text-right text-xs text-red-500">
                                {errors.desiredQuantity}
                            </p>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    </div>

    <div class="flex justify-end gap-3 pt-2">
        <button
            type="button"
            onclick={onCancel}
            class="rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
        >
            Cancel
        </button>
        <button
            type="submit"
            class="rounded-xl bg-lime-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-lime-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
            Confirm
        </button>
    </div>
</form>
