<script lang="ts">
  import { page } from '$app/state';
  import MapSidebar from '$lib/components/Map/MapSidebar.svelte';
  import type { GridBoxType, IconType } from '$lib/types/garden.js';
  import type { SectionData, SectionInfo } from '$lib/types/section.js';
  import { handleReturnGridClasses } from '$lib/utils/grid.js';

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

</script>

<section
  class="box-border min-h-screen bg-[#fdfcf8] px-4 pb-8 pt-12 text-stone-800 sm:px-8 lg:px-12"
>
  <div
    class="mx-auto grid w-full max-w-none items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]"
  >
    <!-- Sidebar -->
  <MapSidebar updateLocalSectionData={updateLocalSectionData} updateSelectedIcon={updateSelectedIcon} selectedIcon={selectedIcon} plantTypes={plantTypes} updateSelectSectionId={updateSelectSectionId} selectedSectionId={selectedSectionId} sectionData={data.sectionData} isEditMode={isEditMode} gardenData={data.gardenData} />
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
        <div class="w-fit flex items-center gap-2">
        {#if (isEditMode)}

          <span
          class="flex items-center h-full gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700"
          >
          <div class="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
          Editing Active
          </span>

        <div class="flex gap-3 h-full items-center">
          <button onclick={cancelEdit} class="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition cursor-pointer">
            Cancel
          </button>
          
          <button onclick={saveEdit} class="px-4 py-2 rounded-md bg-green-200 cursor-pointer text-green-700 hover:bg-green-300 duration-300">
            Save
          </button>
        </div>
        {:else}
        <button onclick={enterEditMode} class="px-4 py-2 rounded-md bg-green-200 cursor-pointer text-green-700 hover:bg-green-300 duration-300">
          Edit
        </button>
        {/if}
      </div>
      </header>

      <!-- Content -->
      <div class="flex flex-1 flex-col overflow-hidden">
          <div class="relative flex items-center justify-center mx-auto h-full w-fit overflow-hidden rounded-md border-stone-200" >
            <div class="grid grid-cols-20 grid-rows-20 border-black/30 border">
                {#each gridToShow as gridItem, i (gridItem.index)}
                  <button
                    aria-label=" "
                    onclick={() => {
                      handleIconPlacement(gridItem)
                      updateCell(i)}}
                    class={`border border-black/30 cursor-pointer flex items-center justify-center w-7 h-7
                    ${handleReturnGridClasses(gridItem.section, localSectionData)}
                    `}
                  >
               {#if (gridItem.plant)}
                      <span class="text-lg leading-none">{typeToIcon(gridItem.plant)}</span>
               {/if}
              </button>
                {/each}
            </div>
          </div>
      </div>
    </div>
  </div>
</section>
