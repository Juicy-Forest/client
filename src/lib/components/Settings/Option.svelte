<script lang="ts">
    import { getContext } from 'svelte';
    
    const { activeTab, setActiveTab, option } = $props();

</script>

<button
        onclick={() => setActiveTab(option.id)}
        class={`p-3 rounded-2xl border transition-all duration-200 flex items-center gap-3 cursor-pointer ${
            activeTab === option.id
                ? 'border-lime-300 bg-lime-50/80 shadow-sm'
                : 'border-stone-200 bg-white/50 hover:border-lime-200 hover:bg-lime-50/50'
        }`}
    >
    <div class={`flex h-8 w-8 items-center justify-center rounded-full ${option.color}`}>
        <i class={option.icon}></i>
    </div>
    <div class="text-left">
        <p class="text-xs font-medium text-stone-400 uppercase tracking-wide">
            {option.label}
        </p>
    </div>
</button>