<script lang="ts">
  const { sectionData, handleSectionClick, handleDeleteSection, selectedSectionId } = $props();
</script>

<div class="flex flex-col w-full gap-2">
  <p class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">
    Available Sections
  </p>
  
  {#each sectionData as section (section._id)}
    <div
      role="button"
      tabindex="0"
      onclick={() => handleSectionClick(section)}
      onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSectionClick(section); }}
      class={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all duration-200 cursor-pointer ${
          selectedSectionId === section._id
              ? 'bg-lime-100/60 ring-1 ring-lime-200/60 shadow-sm'
              : 'hover:bg-stone-100/50'
      }`}
    >
      <div class="flex items-center gap-3">
        <div class={`h-3 w-3 rounded-full ${section.color} ring-2 ring-white shadow-sm`}></div>
        <span class={`font-medium ${selectedSectionId === section._id ? 'text-lime-900' : 'text-stone-700'}`}>
          {section.sectionName}
        </span>
      </div>
      <button
        type="button"
        aria-label="Delete section"
        onclick={(e) => { e.stopPropagation(); handleDeleteSection(section._id); }}
        class="flex h-6 w-6 items-center justify-center rounded-lg text-stone-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-100 hover:text-red-500"
      >
        <i class="fa-solid fa-trash-can text-xs"></i>
      </button>
    </div>
  {:else}
    <div class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stone-200 bg-stone-50/50 px-4 py-6 text-center">
      <div class="rounded-full bg-stone-100 p-2 text-stone-400">
        <i class="fa-solid fa-layer-group text-sm"></i>
      </div>
      <p class="text-xs text-stone-500">No sections yet</p>
    </div>
  {/each}
</div>
