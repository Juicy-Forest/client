<script lang="ts">
  import type { GardenData, Garden, GridBoxType, IconType } from "$lib/types/garden.js";
  import type { SectionData, SectionInfo } from "$lib/types/section.js";
  import { handleReturnGridClasses } from "$lib/utils/grid.js";
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';

  let sensorData = $state({});

  onMount(() => {
    const ws = new WebSocket("ws://localhost:3034");
    ws.onopen = () => {
      console.log('client connected to sensors microservice');
    }
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log(data);
      sensorData = data;
    }
    return () => {
      ws?.close();
    }
  });

  // State variables
  let { data } = $props();
  // from server
  let sectionData: SectionData = data.sectionData.flat();

  let gardens = $state(data?.gardenData ?? []);
  let sectionToDisplay: null | SectionInfo = $state(null);
  let user: any = $state(data.userData);
  let currentGarden = $state(gardens[0]);
  let gardenGrid = $derived(currentGarden?.grid ?? []);
  let grid = $derived(gardenGrid);

  // Get current garden 
  $effect(() => {
    const gardenId = $page.url.searchParams.get('gardenId');
    currentGarden = gardenId ? gardens.find(g => g._id === gardenId) || gardens[0] : gardens[0];
    gardenGrid = currentGarden ? currentGarden.grid : [];
    grid = gardenGrid;
  });

  // Filter sections for current garden
  let currentSections = $derived(sectionData.filter(s => s.garden._id === currentGarden?._id));

  const handleInspectSection = function (sectionId: string | null) {
    if (!sectionId) return;
    const section = currentSections.find((s: SectionInfo) => s._id === sectionId);
    if (!section) return;
    sectionToDisplay = section;
  };

  export const plantTypes: IconType[] = [
    {
      type: "Plant",
      icon: "🌱",
    },
    {
      type: "Bush",
      icon: "🌿",
    },
    {
      type: "Tree",
      icon: "🌾",
    },
    {
      type: "Flower",
      icon: "🌸",
    },
    {
      type: "Greenhouse",
      icon: "🏡",
    },
    {
      type: "Pathway",
      icon: "⬜",
    },
    {
      type: "Pond",
      icon: "🐸",
    },
    {
      type: "Fence",
      icon: "🪜",
    },
  ];
  const typeToIcon = function (type: string) {
    const res = plantTypes.find((obj) => obj.type === type) as IconType;
    return res.icon;
  };
</script>

<section
  class="box-border min-h-screen overflow-hidden bg-[#fdfcf8] px-4 pb-8 pt-12 text-stone-800 sm:px-8 lg:px-12"
>
  <div
    class="mx-auto grid w-full max-w-none items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]"
  >
    <!-- Sidebar -->
    <aside
      class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-3xl border border-stone-200/60 bg-white/60 px-5 py-6 shadow-sm backdrop-blur-xl transition-colors hover:bg-white/80"
    >
      <header class="mb-3 px-2">
        <p class="text-xs font-bold uppercase tracking-widest text-stone-400">
          Overview
        </p>
        <h1 class="mt-1 text-lg font-bold tracking-tight text-stone-800">
          Garden Information
        </h1>
      </header>

      <div class="flex-1 overflow-y-auto pr-1">
        <div class="flex flex-col gap-2">
          <div
            class="p-3 rounded-2xl border border-stone-200 bg-white/50 flex items-center gap-3 transition-all hover:border-lime-200 hover:bg-lime-50/50"
          >
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full bg-lime-100 text-lime-700"
            >
              <i class="fa-solid fa-location-pin"></i>
            </div>
            <div>
              <p
                class="text-xs font-medium text-stone-400 uppercase tracking-wide"
              >
                Location
              </p>
              <p class="text-sm font-bold text-stone-700">
                {currentGarden.location.address}
              </p>
            </div>
          </div>
          <div
            class="p-3 rounded-2xl border border-stone-200 bg-white/50 flex items-center gap-3 transition-all hover:border-lime-200 hover:bg-lime-50/50"
          >
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full bg-lime-100 text-lime-700"
            >
              <i class="fa-solid fa-user"></i>
            </div>
            <div>
              <p
                class="text-xs font-medium text-stone-400 uppercase tracking-wide"
              >
                Member count
              </p>
              <p class="text-sm font-bold text-stone-700">
                {currentGarden.members.length} / {currentGarden.maxMembers} members
              </p>
            </div>
          </div>
        </div>

        <div class="mt-8 px-2">
          <p
            class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3"
          >
            Status Key
          </p>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <div
                class="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
              ></div>
              <span class="text-sm text-stone-600">Good Condition</span>
            </div>
            <div class="flex items-center gap-2">
              <div
                class="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.4)]"
              ></div>
              <span class="text-sm text-stone-600">Requires Attention</span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div
      class="flex h-[calc(100vh-10.5rem)] flex-col rounded-[2.5rem] border border-stone-200/60 bg-white/80 shadow-xl shadow-stone-200/20 backdrop-blur-xl"
    >
      <!-- Header -->
      <header
        class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-white/50 px-8 py-5 backdrop-blur-sm"
      >
        <div>
          <h2 class="text-lg font-bold text-stone-800">
            Greetings, {user.username}
          </h2>
          <p class="mt-0.5 text-sm text-stone-500">
            Here's your daily garden overview.
          </p>
        </div>
        <!-- <button
          class="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600 transition-all hover:bg-stone-50 hover:text-stone-800 hover:border-stone-300 shadow-sm"
        >
          <i class="fa-solid fa-gear text-stone-400"></i>
          <span>Settings</span>
        </button> -->
      </header>

      <!-- Content -->
      <div class="flex flex-1 flex-col overflow-hidden bg-stone-50/30">
        <div class="flex flex-1 items-center justify-center overflow-hidden px-8 py-6">
          <div class="relative rounded-2xl border border-stone-200/60 bg-white/60 p-4 shadow-sm backdrop-blur-sm">
            <div class="rounded-xl overflow-hidden border border-stone-300/50 shadow-inner">
              <div class="grid grid-cols-20 grid-rows-20">
                {#each grid as gridItem, i (gridItem.index)}
                  <button
                    onclick={() =>
                      handleInspectSection(
                        gridItem.section && gridItem.section
                      )}
                    aria-label="Grid cell"
                    class={`border border-stone-300/40 cursor-pointer flex items-center justify-center w-7 h-7 transition-all hover:brightness-95
                      ${handleReturnGridClasses(gridItem.section, currentSections)} `}
                  >
                    {#if gridItem.plant}
                      <span class="text-lg leading-none drop-shadow-sm"
                        >{typeToIcon(gridItem.plant)}</span
                      >
                    {/if}
                  </button>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- {#if showSettings}
      <div
        class="fixed inset-0 bg-black/45 flex items-center justify-center z-50"
      >
        <div
          class="h-screen overflow-y-scroll w-fit min-w-[1000px] p-6 bg-white rounded-xl shadow-lg relative overflow-hidden"
        >
          <div class="w-full flex items-center justify-between mb-4">
            <p class="font-semibold text-xl">Garden Configuration</p>
            <button aria-label=" " on:click={() => (showSettings = false)}>
              <i
                class="fa-solid fa-xmark cursor-pointer hover:text-rose-400 duration-300"
              ></i>
            </button>
          </div>

          <div class="flex w-full mb-4 bg-gray-100 rounded-xl p-1 gap-1">
            <button
              class="flex-1 py-2 rounded-lg text-sm font-medium duration-200
                {activeTab === 'image'
                ? 'bg-white shadow'
                : 'hover:bg-gray-200'}"
              on:click={() => switchTab("image")}
            >
              Image
            </button>

            <button
              class="flex-1 py-2 rounded-lg text-sm font-medium duration-200
                {activeTab === 'divisions'
                ? 'bg-white shadow'
                : 'hover:bg-gray-200'}"
              on:click={() => switchTab("divisions")}
            >
              Divisions
            </button>
          </div> -->
    <!-- image tab content -->
    <!-- {#if activeTab === "image"}
            <p class="font-medium mb-2">Garden Image</p>

            <label
              class="w-full h-[150px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 text-center"
            >
              <i class="fa-regular fa-upload text-gray-400 text-3xl mb-2"></i>
              <p class="text-gray-500 text-sm">
                Click to upload a custom garden image
              </p>
              <p class="text-gray-400 text-xs">PNG, JPG up to 10MB</p>

              <input
                type="file"
                accept="image/*"
                class="hidden"
                on:change={handleImageUpload}
              />
            </label>
            {#if uploadedImageUrl}
              <div class="mt-4">
                <img
                  src={uploadedImageUrl}
                  alt="Garden preview"
                  class="w-full h-auto object-contain rounded-md"
                />
              </div>
            {:else}
              <p class="mt-4 text-gray-500 text-sm italic text-center">
                No image uploaded yet. Upload an image above to preview it.
              </p>
            {/if}
          {/if} -->

    <!-- {#if activeTab === "divisions"}
            <div class="w-fit mx-auto h-fit flex-col lg:flex-row flex gap-2">
              <div
                class="w-full min-w-[300px] lg:w-[20%] flex flex-col gap-3 h-fit p-4"
              >
                <p>
                  Select a section, and pick which tiles belong to that section.
                </p>
                {#each sectionInfo as section (section.sectionName)}
                  <button
                    on:click={() => handleSelectSection(section.id)}
                    class="w-full cursor-pointer border {section.color} p-2 text-left rounded-md {section.id ===
                      selectedSection && 'font-semibold'}"
                    >{section.sectionName}</button
                  >
                {/each}
                <button
                  on:click={() => clearEntireGrid()}
                  class="bg-rose-200 cursor-pointer rounded-md py-2 mt-5 text-rose-700 border border-rose-700"
                  >Clear All Tiles</button
                >
              </div>
              <div class="w-full h-full p-4">
                <div class="h-[600px] w-[600px] relative">
                  <img
                    src={uploadedImageUrl ||
                      "/images/JUICY_FOREST_FOOD_GARDEN.png"}
                    alt="Birds-eye-view food garden"
                    class="block h-full w-full object-cover z-50"
                  />
                  <div
                    class="absolute top-0 left-0 z-100 w-[600px] h-[600px] bg-blue-100/10 flex flex-wrap"
                  >
                    {#each gridToEdit as gridItem (gridItem.id)}
                      <button
                        aria-label=" "
                        class={`w-[5%] h-[5%] border-[0.5px] border-black/30  cursor-pointer ${gridItem.section ? sectionInfo.find((s) => s.id === gridItem.section)?.color : ""}`}
                        on:click={() => editGrid(gridItem.id)}
                      ></button>
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          {/if} -->

    <!-- Divider -->
    <!-- <div class="border-t mt-6 mb-4"></div>

          <div class="flex justify-end gap-2">
            <button
              on:click={() => (showSettings = false)}
              class="px-5 py-2 rounded-lg border border-gray-300 bg-rose-200 text-rose-700 hover:bg-gray-100"
            >
              Close
            </button>
            <button
              on:click={() => handleSaveGridChanges()}
              class="px-5 py-2 bg-green-200 text-green-800 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    {/if} -->

    <!-- Section info opened on click of section -->

    {#if sectionToDisplay}
      <!-- Backdrop -->
      <button
        class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onclick={() => (sectionToDisplay = null)}
        tabindex="-1"
        aria-label="Close panel"
        transition:fade={{ duration: 200 }}
      ></button>
      
      <!-- Panel -->
      <div
        class="fixed flex flex-col w-[420px] right-0 top-0 h-screen bg-white/95 backdrop-blur-xl shadow-2xl z-50 border-l border-stone-200/60"
        transition:fly={{ x: 420, duration: 300, opacity: 1 }}
      >
        <!-- Header -->
        <div class="px-6 py-5 border-b border-stone-100 bg-white/80">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class={`flex h-10 w-10 items-center justify-center rounded-xl ${sectionToDisplay?.issues?.length > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                <i class={`fa-solid ${sectionToDisplay?.issues?.length > 0 ? 'fa-exclamation' : 'fa-check'} text-sm`}></i>
              </div>
              <div>
                <h3 class="font-bold text-stone-800">{sectionToDisplay?.sectionName}</h3>
                <p class="text-xs text-stone-500">
                  Assigned to <span class="font-semibold text-stone-700">{sectionToDisplay.assignedTo}</span>
                </p>
              </div>
            </div>
            <button 
              onclick={() => (sectionToDisplay = null)}
              class="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
              aria-label="Close panel"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
        
        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-6 py-5">
          <!-- Status Banner -->
          <div class={`rounded-2xl p-4 mb-6 ${sectionToDisplay?.issues?.length > 0 ? 'bg-rose-50 border border-rose-200' : 'bg-emerald-50 border border-emerald-200'}`}>
            {#if sectionToDisplay?.issues && sectionToDisplay.issues.length > 0}
              <div class="flex items-center gap-2 mb-3">
                <i class="fa-solid fa-triangle-exclamation text-rose-500"></i>
                <p class="text-sm font-semibold text-rose-700">Unresolved Issues</p>
              </div>
              <div class="space-y-2">
                {#each sectionToDisplay.issues as issue (issue.issueDescription)}
                  <div class="flex items-start gap-2 text-sm text-rose-600 bg-white/60 rounded-lg px-3 py-2">
                    <i class="fa-solid fa-circle text-[4px] mt-2 shrink-0"></i>
                    <span>{issue.issueDescription} <span class="text-rose-400">({issue.criticalLevel})</span></span>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-circle-check text-emerald-500"></i>
                <p class="text-sm font-medium text-emerald-700">All systems healthy — no issues detected</p>
              </div>
            {/if}
          </div>

          <!-- Sensor Data -->
          <div class="mb-6">
            <p class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Real-time Sensors</p>
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 rounded-xl border border-stone-200 bg-white/80">
                <div class="flex items-center gap-2 mb-1">
                  <i class="fa-solid fa-droplet text-sky-500 text-xs"></i>
                  <span class="text-xs text-stone-500">Humidity</span>
                </div>
                <p class="text-lg font-bold text-stone-800">{(sensorData as any).humidity}<span class="text-sm text-stone-400">%</span></p>
              </div>
              <div class="p-3 rounded-xl border border-stone-200 bg-white/80">
                <div class="flex items-center gap-2 mb-1">
                  <i class="fa-solid fa-temperature-half text-orange-500 text-xs"></i>
                  <span class="text-xs text-stone-500">Temperature</span>
                </div>
                <p class="text-lg font-bold text-stone-800">{(sensorData as any).temperature}<span class="text-sm text-stone-400">°C</span></p>
              </div>
              <div class="p-3 rounded-xl border border-stone-200 bg-white/80">
                <div class="flex items-center gap-2 mb-1">
                  <i class="fa-solid fa-water text-cyan-500 text-xs"></i>
                  <span class="text-xs text-stone-500">Soil Moisture</span>
                </div>
                <p class="text-lg font-bold text-stone-800">{(sensorData as any).soilMoisture}<span class="text-sm text-stone-400">%</span></p>
              </div>
              <div class="p-3 rounded-xl border border-stone-200 bg-white/80">
                <div class="flex items-center gap-2 mb-1">
                  <i class="fa-solid fa-sun text-amber-500 text-xs"></i>
                  <span class="text-xs text-stone-500">Light</span>
                </div>
                <p class="text-lg font-bold text-stone-800">{(sensorData as any).lightIntensity}<span class="text-sm text-stone-400"> lux</span></p>
              </div>
            </div>
          </div>

          <!-- Plants -->
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Plants in Section</p>
            {#if sectionToDisplay?.plants?.length > 0}
              <div class="flex flex-wrap gap-2">
                {#each sectionToDisplay.plants as plant (plant)}
                  <span class="inline-flex items-center gap-1.5 rounded-full bg-lime-100 px-3 py-1.5 text-sm font-medium text-lime-800">
                    <i class="fa-solid fa-seedling text-xs text-lime-600"></i>
                    {plant}
                  </span>
                {/each}
              </div>
            {:else}
              <div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-200 bg-stone-50/50 py-6 text-center">
                <i class="fa-solid fa-seedling text-stone-300 text-xl mb-2"></i>
                <p class="text-xs text-stone-500">No plants in this section</p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
</section>
