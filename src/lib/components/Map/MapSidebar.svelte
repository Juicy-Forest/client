<script lang="ts">
  import { globalData, isEditMode, selectedSectionId } from "$lib/state/data";
  import type { IconType } from "$lib/types/garden";
  import CreateNewSection from "./CreateNewSection.svelte";
  import SidebarSections from "./SidebarSections.svelte";

  const {
    plantTypes,
    selectedIcon,
    updateSelectedIcon,
  } = $props();


  let userData = $derived($globalData.userDataState)
  let gardenData = $derived($globalData.gardenDataState)
  let sectionData = $derived($globalData.sectionDataState)


  const updateSelectSectionId = (newSectionId: string) => selectedSectionId.set(newSectionId)

  const handleSectionClick = function (section: any) {
    if ($isEditMode) {
      updateSelectSectionId(section._id);
    } else {
      // notify user they must be in edit mode first or let it
      //  highlight all related section tiles
    }
  };

  function selectIcon(icon: IconType) {
    updateSelectedIcon(selectedIcon === icon ? null : icon);
    updateSelectSectionId('');
  }
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
      <div class="rounded-2xl border border-stone-200 bg-stone-50/50 p-4">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-xl">📍</span>
          <div>
            <p class="text-sm font-bold text-stone-700">Amsterdam Garden</p>
            <p class="text-xs text-stone-500">Netherlands</p>
          </div>
        </div>
      </div>

      <div class=" mb-0 border-t border-stone-200"></div>
      <!-- // show current sections -->
      <SidebarSections />

      {#if !sectionData || sectionData.length === 0}
        <span class="font-semibold text-xs my-1"
          >Note: Create a section to get started.</span
        >
      {/if}
      {#if $isEditMode}
        <div class="my-2 border-t border-stone-200"></div>
        <!-- -----NEW SECTION ----- -->
       <CreateNewSection/>
        <div class="my-2 border-t border-stone-200"></div>

        <!-- ----- PLANTS ----- -->
        <div class="w-full h-[30px]">
          <p
            class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1"
          >
            Add Plants
          </p>
          <div class="grid grid-cols-2 gap-2">
            {#each plantTypes as plant (plant.type)}
              <button
                type="button"
                class={`flex flex-col items-center justify-center gap-1 rounded-xl border p-3 transition-all border-stone-200 text-stone-600 hover:border-stone-300  cursor-pointer ${selectedIcon?.type === plant.type ? "bg-stone-200" : "hover:bg-stone-50"}
             
              `}
                onclick={() => selectIcon(plant)}
              >
                <span class="text-2xl">{plant.icon}</span>
                <span class="text-[10px] font-bold uppercase tracking-wide"
                  >{plant.type}</span
                >
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</aside>
