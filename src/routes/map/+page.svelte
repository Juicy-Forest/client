<script lang="ts">
  import { invalidate } from '$app/navigation';
  import type { GridBoxType, IconType } from '$lib/types/garden.js';
  import type { SectionInfo } from '$lib/types/section.js';
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

  let colorOptions = [
{ tailwindclass: "bg-rose-400" },
{ tailwindclass: "bg-green-300" },
{ tailwindclass: "bg-blue-400" },
{ tailwindclass: "bg-yellow-300" },
{ tailwindclass: "bg-purple-400" },
{ tailwindclass: "bg-orange-400" },
{ tailwindclass: "bg-teal-300" },
{ tailwindclass: "bg-pink-400" },
{ tailwindclass: "bg-lime-300" },
{ tailwindclass: "bg-sky-400" },
{ tailwindclass: "bg-amber-400" },
{ tailwindclass: "bg-indigo-400" },
{ tailwindclass: "bg-fuchsia-400" }

]

// states
  let selectedColor = $state('')
  let sectionName = $state('')
  let plants = $state('')
  let newSectionErrorMsg = $state('')
  let selectedSectionId = $state('')
  let isEditMode = $state(false);

  let sectionInfo: SectionInfo[] = $state([]);
  const gardenGrid = data.gardenData ? data.gardenData[0].grid : [] // find way to fix, will always exist, made with garden init
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

  const handleCreateSection = async function() {
    if(!selectedColor || ! sectionName) {
        newSectionErrorMsg = 'Color & Name is required.'
    return
    }
    newSectionErrorMsg = '';
    const sectionResponse = await fetch('/api/section', {
        method: "POST", 
        body: JSON.stringify({
            sectionName, 
            plants: plants.split(", "),
            color: selectedColor,
            gardenId: data.gardenData ? data.gardenData[0]._id : '' // think of fix, gardenData will always exist
        })
    })
    const parsedSectionResponse = await sectionResponse.json()
    if(parsedSectionResponse._id) {
        await invalidate("data:sections") 
  
    }   else {    
    // Handle err
        console.log("Error trying to create new section:", parsedSectionResponse.error)
    }
  }

  const handleNameChange = (v: string) => sectionName = v
  const handlePlantChange = (v: string) => plants = v

  const handleDeleteSection = async function(id: string) {
    // todo deltet section
    const deleteSectionResponse = await fetch(`/api/section/${id}`, {
        method: "DELETE",
    })
    const parsedRes = await deleteSectionResponse.json()
    if(parsedRes.status === 500) {
        // handle error message, (use toastify for errors)
        return 
    }
    await invalidate("data:sections")
  }

  const cloneGrid = function (source: GridBoxType[]): GridBoxType[] {
    return source.map(cell => ({ ...cell }));
  }

const enterEditMode = function() {
  editingGrid = cloneGrid(grid);
  gridToShow = editingGrid;
  isEditMode = true;
}

const saveEdit = async function() {
  if(JSON.stringify(editingGrid) !== JSON.stringify(grid)) {
    // updated garden obj
    const newGarden = {
      ...data.gardenData![0],
      grid: editingGrid.map(cell => ({ ...cell }))
    };    
    await fetch(`api/garden/${data.gardenData![0]._id}`, {
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

  const handleSectionClick = function(section:any) {
    if(isEditMode) {
      selectedSectionId = section._id
    } else {
      // notify user they must be in edit mode first or let it
      //  highlight all related section tiles
    }
  }


const typeToIcon = function(type: string) {
  const res = plantTypes.find((obj) => obj.type === type) as IconType
  return res.icon 
}

  function selectIcon(icon: IconType) {
    selectedIcon = selectedIcon === icon ? null : icon;
    selectedSectionId = ''
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
           <div class="flex flex-col w-full gap-1">
            <p
              class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">
              Available Sections
            </p>
            <!-- idk what this is, VScode suggested quick fix, otherwise underlined yellow -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            {#each data.sectionData as section (section._id)}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div  onclick={() => handleSectionClick(section)} class="w-full p-2 flex items-center justify-between cursor-pointer border-gray-200 border rounded-md {selectedSectionId === section._id && 'font-semibold'} {section.color}">
              <p>{section.sectionName}</p>
              <button aria-label=" " onclick={() => handleDeleteSection(section._id)} class="border active:scale-[0.7] transform duration-200 border-gray-300 text-gray-700 flex items-center justify-center w-5 h-5 rounded-md cursor-pointer bg-gray-100" >
                <i class="fa-solid fa-x scale-[0.5]"></i>
              </button>
            </div>
            {/each}
          </div>
          
          {#if !data.sectionData || data.sectionData.length === 0} 
          <span class="font-semibold text-xs my-1">Note: Create a section to get started.</span>
          {/if}
          {#if (isEditMode)}
          <div class="my-2 border-t border-stone-200"></div>

          <div class="">
            <p
              class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1"
            >
              Add section
            </p>
            <p class="text-xs text-rose-400 font-semibold mb-1">{newSectionErrorMsg}</p>
              <div class="w-full flex flex-col items-start gap-2 px-1">
                  <input onchange={(e) => handleNameChange((e.target as HTMLInputElement).value || "")} value={sectionName} class="p-2 w-full  rounded-md  bg-none placeholder:text-xs text-black/80 border border-black/30" type="text" placeholder="Section name">
                  <input onchange={(e) => handlePlantChange((e.target as HTMLInputElement).value || "")} value={plants} class="p-2  w-full rounded-md bg-none outline-none  text-black/80 border placeholder:text-xs border-black/30" type="text" placeholder="Plants (comma separated)">
                <div class="flex flex-wrap gap-1 w-full h-fit">
                    {#each colorOptions as color (color.tailwindclass)}
                        <button onclick={() => selectedColor = color.tailwindclass} class="rounded-md w-5 h-5 cursor-pointer {color.tailwindclass} {selectedColor === color.tailwindclass && 'border border-black'}"></button>
                    {/each}
                </div>
                  <button
                    onclick={() => handleCreateSection()}
                    class={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${isEditMode ? "bg-amber-100 text-amber-800 ring-1 ring-amber-200" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
                  >
                    <i class="fa-solid fa-pen"></i>
                    <span>Create Section</span>
                  </button>
            </div>
          </div>
          <div class="my-2 border-t border-stone-200"></div>
          <div class="w-full h-[30px] ">
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
                    ${handleReturnGridClasses(gridItem.section, data.sectionData)}
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
