<script>
    export let checked = false;
    export let label = '';
    export let onChange = () => {};
</script>

<label class="flex w-full cursor-pointer items-center gap-3">
    <div class="relative flex items-center">
        <input type="checkbox"
            class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-stone-300 transition-all checked:border-lime-500 checked:bg-lime-500 hover:border-lime-400 focus:ring-2 focus:ring-lime-200 focus:ring-offset-1"
            bind:checked
            on:change={onChange} />
        <i class="fa-solid fa-check absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-white opacity-0 transition-opacity peer-checked:opacity-100"></i>
    </div>
    <span class={`text-sm font-medium transition-colors ${checked ? 'text-stone-400 line-through' : 'text-stone-700'}`}>{label}</span>
</label>
