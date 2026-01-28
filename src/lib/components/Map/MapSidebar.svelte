<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { page } from '$app/state';
  import type { IconType } from '$lib/types/garden';
  import type { SectionInfo } from '$lib/types/section';
  import CreateNewSection from './CreateNewSection.svelte';
  import SidebarSections from './SidebarSections.svelte';

  const {
      sectionData: initSectionData,
      isEditMode,
      gardenData,
      selectedSectionId,
      updateSelectSectionId,
      plantTypes,
      selectedIcon,
      updateSelectedIcon,
      updateLocalSectionData
  } = $props();
  
  const gardenId = $derived(() => page.url.searchParams.get('gardenId'));

  const handleSectionClick = function (section: any) {
      if (isEditMode) {
          updateSelectSectionId(section._id);
      } 
  };

  function selectIcon(icon: IconType) {
      updateSelectedIcon(selectedIcon === icon ? null : icon);
      updateSelectSectionId('');
  }

  let sectionData = $state<SectionInfo[]>(
      structuredClone(initSectionData)
  );

  const selectedGardenSectionData = $derived(() => {
      const id = gardenId();
      if (!id) return [];
      return sectionData.filter(s => s.garden._id === id);
  });

  const updateGardenSections = (newSection: SectionInfo) => {
      sectionData = [...sectionData, newSection];
      updateLocalSectionData(newSection);
  };

    const handleDeleteSection = async function (id: string) {
        const deleteSectionResponse = await fetch(`/api/section/${id}`, {
            method: 'DELETE',
        });

        const parsedRes = await deleteSectionResponse.json();
        if (parsedRes.status === 500) {
            // handle error message, (use toastify for errors)
            return;
        }
        await invalidate('data:sections');
        sectionData = sectionData.filter(s => s._id !== id);
    };

</script>

<aside
  class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-3xl border border-stone-200/60 bg-white/60 px-5 py-6 shadow-sm backdrop-blur-xl transition-colors hover:bg-white/80"
>
  <header class="mb-6 px-2">
    <p class="text-xs font-bold uppercase tracking-widest text-stone-400">
      Navigation
    </p>
    <h1 class="mt-1 text-lg font-bold tracking-tight text-stone-800">
      Garden Map
    </h1>
  </header>

  <div class="flex-1 overflow-y-auto pr-1">
    <div class="flex flex-col gap-3">
      <div class="rounded-2xl border border-stone-200 bg-white/50 p-3 transition-all hover:border-lime-200 hover:bg-lime-50/30">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
            <i class="fa-solid fa-location-dot"></i>
          </div>
          <div>
            <p class="text-sm font-bold text-stone-700">Amsterdam Garden</p>
            <p class="text-xs text-stone-500">Netherlands</p>
          </div>
        </div>
      </div>

      <!-- Sections -->
      <SidebarSections
        {selectedSectionId}
        {sectionData}
        {handleSectionClick}
        {handleDeleteSection}
      />

      {#if isEditMode}
        <!-- New Section Form -->
        <CreateNewSection
          onNewSection={updateGardenSections}
          {isEditMode}
          {gardenData}
        />

        <!-- Plants Grid -->
        <div class="rounded-2xl border border-stone-200/60 bg-white/60 p-4">
          <p class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">
            Add Plants
          </p>
          <div class="grid grid-cols-2 gap-2">
            {#each plantTypes as plant (plant.type)}
              <button
                type="button"
                class={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 transition-all cursor-pointer ${
                    selectedIcon?.type === plant.type 
                        ? 'bg-lime-100/60 border-lime-300 ring-1 ring-lime-200' 
                        : 'border-stone-200 bg-white/80 hover:bg-stone-50 hover:border-stone-300'
                }`}
                onclick={() => selectIcon(plant)}
              >
                <span class="text-2xl">{plant.icon}</span>
                <span class={`text-[10px] font-bold uppercase tracking-wide ${
                    selectedIcon?.type === plant.type ? 'text-lime-700' : 'text-stone-500'
                }`}>{plant.type}</span>
              </button>
            {/each}
          </div>
        </div>
      {:else}
        <div class="rounded-2xl border border-dashed border-stone-200 bg-stone-50/30 p-4 text-center">
          <div class="flex flex-col items-center gap-2">
            <div class="rounded-full bg-stone-100 p-2 text-stone-400">
              <i class="fa-solid fa-pen-to-square text-sm"></i>
            </div>
            <p class="text-xs text-stone-500">Click <span class="font-semibold text-lime-600">Edit Map</span> to add sections and plants</p>
          </div>
        </div>
      {/if}
    </div>
  </div>
</aside>
