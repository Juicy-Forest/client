<script lang="ts">
  import { page } from '$app/state';
  import MapSidebar from '$lib/components/Map/MapSidebar.svelte';
  import type { GridBoxType, IconType } from '$lib/types/garden.js';
  import type { SectionData, SectionInfo } from '$lib/types/section.js';
  import { handleReturnGridClasses } from '$lib/utils/grid.js';
  import Toast from '$lib/components/UI/Toast.svelte';

  const { data } = $props();
  export const plantTypes: IconType[] = [{
    type: "Plant",
    icon: "🌱"
  }, {
    type: "Bush",
    icon: "🌿"
  },
  {
    type: "Tree",
    icon: "🌾"
  },
  {
    type: "Flower",
    icon: "🌸"
  },
  {
    type: "Greenhouse",
    icon: "🏡"
  },
  {
    type: "Pathway",
    icon: "⬜"
  },
  {
    type: "Pond",
    icon: "🐸"
  },
  {
    type: "Fence",
    icon: "🪜"
  },
];

// states
  let selectedSectionId = $state('')
  let isEditMode = $state(false);
  let localSectionData: SectionData = $state(data.sectionData)
  let showSuccessToast = $state(false);

  const updateLocalSectionData = function(newItem: SectionInfo) {
    localSectionData = [...localSectionData, newItem]
  }

  const updateSelectSectionId = (newSectionId: string) =>{
    selectedSectionId = newSectionId
  }

  const updateSelectedIcon = (newIcon: IconType) => selectedIcon = newIcon
  const gardenId = page.url.searchParams.get('gardenId')
  const currentGarden = gardenId ? data.gardenData.find((g) => g._id === gardenId) : data.gardenData[0]
  const gardenGrid = currentGarden.grid 
  let grid: GridBoxType[] = $state(gardenGrid);        
  let editingGrid: GridBoxType[] = $state([]);           
  // svelte-ignore state_referenced_locally
  let gridToShow: GridBoxType[] = $state(grid);
  let selectedIcon: IconType | null = $state(null);


  // handlers and functionality
  const updateCell = function (i: number) {
    if(!isEditMode) return
    const next = [...editingGrid];
    if(selectedSectionId) {
      next[i] = { ...next[i], section: next[i].section ? null : selectedSectionId };
    } else if (selectedIcon) {
      next[i] = {...next[i], plant: selectedIcon.type}
    }
    // const selectedSection = data.sectionData?.find((s: any) => s._id === selectedSectionId)
    editingGrid = next;
    gridToShow = next; 
  }

  const cloneGrid = function (source: GridBoxType[]): GridBoxType[] {
    return source.map((cell) => ({ ...cell }));
  };

  const enterEditMode = function() {
    editingGrid = cloneGrid(grid);
    gridToShow = editingGrid;
    isEditMode = true;
  }

const saveEdit = async function() {
  if(JSON.stringify(editingGrid) !== JSON.stringify(grid)) {
    // updated garden obj
    const newGarden = {
      ...currentGarden,
      grid: editingGrid.map(cell => ({ ...cell }))
    };    
    await fetch(`api/garden/${currentGarden._id}`, {
      method: "PUT",
      headers:  {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({updatedGarden: newGarden})
    })
  } 
  grid = cloneGrid(editingGrid);
  exitEditMode();
  
  // Show success toast
  showSuccessToast = true;
  setTimeout(() => {
    showSuccessToast = false;
  }, 3000);
}

const cancelEdit = function() {
  exitEditMode();
}

const exitEditMode = function() {
  gridToShow = grid;
  editingGrid = [];
  isEditMode = false;
}


const typeToIcon = function(type: string) {
  const res = plantTypes.find((obj) => obj.type === type) as IconType
  return res.icon 
}


const handleIconPlacement = function(grid: GridBoxType) {
  if(selectedIcon) {
    const updatedGrid = gridToShow.map((tile: GridBoxType) => {
      if(tile.index === grid.index) {
        return {...tile, plant: selectedIcon!.type}
      } else {
        return tile
      }
    })
    gridToShow = updatedGrid
  }
}

const sectionDataForGarden = data.sectionData.filter((section: SectionInfo) => section.garden._id === currentGarden._id)

</script>

<section
  class="box-border min-h-screen bg-[#fdfcf8] px-4 pb-8 pt-12 text-stone-800 sm:px-8 lg:px-12"
>
  <div
    class="mx-auto grid w-full max-w-none items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]"
  >
    <!-- Sidebar -->
  <MapSidebar updateLocalSectionData={updateLocalSectionData} updateSelectedIcon={updateSelectedIcon} selectedIcon={selectedIcon} plantTypes={plantTypes} updateSelectSectionId={updateSelectSectionId} selectedSectionId={selectedSectionId} sectionData={sectionDataForGarden} isEditMode={isEditMode} gardenData={data.gardenData} />
    <!-- Main Content -->
    <div
      class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-white/80 shadow-xl shadow-stone-200/20 backdrop-blur-xl"
    >
      <!-- Header -->
      <header
        class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-white/50 px-8 py-5 backdrop-blur-sm"
      >
        <div>
          <h2 class="text-lg font-bold text-stone-800">Interactive Layout</h2>
          <p class="mt-0.5 text-sm text-stone-500">
            {isEditMode
              ? "Select an item from the sidebar and click on the map to place it."
              : "Visualize and manage plants in your garden."}
          </p>
        </div>
        <div class="flex items-center gap-3">
        {#if (isEditMode)}
          <span class="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
            <div class="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
            Editing
          </span>

          <div class="flex gap-2 items-center">
            <button 
              onclick={cancelEdit} 
              class="flex h-9 items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 text-xs font-semibold text-stone-600 transition-all hover:bg-stone-50 hover:border-stone-300"
            >
              <i class="fa-solid fa-xmark text-stone-400"></i>
              Cancel
            </button>
            
            <button 
              onclick={saveEdit} 
              class="flex h-9 items-center gap-2 rounded-xl bg-lime-600 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-lime-700"
            >
              <i class="fa-solid fa-check"></i>
              Save
            </button>
          </div>
        {:else}
          <button 
            onclick={enterEditMode} 
            class="flex h-9 items-center gap-2 rounded-xl bg-lime-600 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-lime-700"
          >
            <i class="fa-solid fa-pen-to-square"></i>
            Edit Map
          </button>
        {/if}
      </div>
      </header>

      <!-- Content -->
      <div class="flex flex-1 flex-col overflow-hidden bg-stone-50/30">
          <div class="flex flex-1 items-center justify-center overflow-hidden px-8 py-6">
            <div class="relative rounded-2xl border border-stone-200/60 bg-white/60 p-4 shadow-sm backdrop-blur-sm">
              <div class="rounded-xl overflow-hidden border border-stone-300/50 shadow-inner">
                <div class="grid grid-cols-20 grid-rows-20">
                  {#each gridToShow as gridItem, i (gridItem.index)}
                    <button
                      aria-label="Grid cell"
                      onclick={() => {
                        handleIconPlacement(gridItem)
                        updateCell(i)}}
                      class={`border border-stone-300/40 cursor-pointer flex items-center justify-center w-7 h-7 transition-all hover:brightness-95
                      ${handleReturnGridClasses(gridItem.section, localSectionData)}
                      `}
                    >
                      {#if (gridItem.plant)}
                        <span class="text-lg leading-none drop-shadow-sm">{typeToIcon(gridItem.plant)}</span>
                      {/if}
                    </button>
                  {/each}
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>

</section>

<Toast 
  bind:show={showSuccessToast}
  title="Changes saved successfully"
  message="Your map has been updated"
  type="success"
/>
