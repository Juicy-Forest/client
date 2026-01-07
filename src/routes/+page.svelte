<script lang="ts">
  import type { GardenData, Garden, GridBoxType, IconType } from "$lib/types/garden.js";
  import type { SectionData, SectionInfo } from "$lib/types/section.js";
  import { handleReturnGridClasses } from "$lib/utils/grid.js";
  import { page } from '$app/stores';
    import { setContext } from "svelte";

  // State variables
  let { data } = $props();
  // from server
  let gardenData: GardenData = data.gardenData;
  let sectionData: SectionData = data.sectionData.flat();

  let gardens = $state(data?.gardenData ?? []);
  let sectionToDisplay: null | SectionInfo = $state(null);
  let user: any = $state(data.userData);
  let currentGarden = $state(gardens[0]);
  let gardenGrid = $state(currentGarden?.grid ?? []);
  let grid = $state(gardenGrid);

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
        <div class="flex-1 overflow-hidden px-8 py-6">
          <div
            class="relative mx-auto h-full w-fit overflow-hidden rounded-md border-stone-200"
          >
            <div class="relative rounded-md overflow-hidden w-[600px]">
              <div
                class=" w-fit h-fit inset mx-auto border-black/30 border z-10 grid grid-cols-20 grid-rows-20"
              >
                {#each grid as gridItem, i (gridItem.index)}
                  <button
                    onclick={() =>
                      handleInspectSection(
                        gridItem.section && gridItem.section
                      )}
                    aria-label=" "
                    class={`border border-black/30 cursor-pointer flex items-center justify-center w-7 h-7
                      ${handleReturnGridClasses(gridItem.section, currentSections)} `}
                  >
                    {#if gridItem.plant}
                      <span class="text-lg leading-none"
                        >{typeToIcon(gridItem.plant)}</span
                      >
                    {/if}
                  </button>
                {/each}
              </div>
              <!-- {#each sectionInfo as sectionItem (sectionItem.sectionName)}
                <div class="w-1/2 h-1/2 p-1">
                  <button
                    on:click={(e) => handleInspectSection(sectionItem)}
                    class={`w-full h-full rounded-2xl border-2 p-4 flex flex-col justify-between transition-all duration-200 hover:scale-[0.98] cursor-pointer ${sectionItem.issues.length > 0 ? "bg-rose-500/20 border-rose-400 hover:border-rose-500 hover:bg-rose-500/30" : "bg-green-600/20 border-green-500 hover:border-green-400 hover:bg-green-600/30"}`}
                  >
                    <div class="flex items-center justify-between">
                      <div class="rounded-full bg-white px-3 py-1 shadow-sm">
                        <p class="text-xs font-bold text-stone-700">
                          {sectionItem.assignedTo}
                        </p>
                      </div>
                      {#if sectionItem.issues.length > 0}
                        <div
                          class="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600 shadow-sm"
                        >
                          <i class="fa-solid fa-exclamation text-xs"></i>
                        </div>
                      {:else}
                        <div
                          class="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm"
                        >
                          <i class="fa-solid fa-check text-xs"></i>
                        </div>
                      {/if}
                    </div>
                    <p
                      class="text-white font-bold text-lg drop-shadow-md text-left"
                    >
                      {sectionItem.sectionName}
                    </p>
                  </button>
                </div>
              {/each} -->
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
      <div
        class="absolute flex flex-col min-w-[400px] max-w-[500px] right-0 top-0 h-screen border border-gray-300 bg-white shadow-xl z-100"
      >
        <div
          class="w-full p-7 flex items-center justify-between border-b border-gray-300"
        >
          <div class="flex items-center gap-2">
            {#if sectionToDisplay && sectionToDisplay?.issues.length > 0}
              <div class="w-3 h-3 rounded-full bg-rose-600"></div>
            {/if}
            {#if sectionToDisplay && sectionToDisplay?.issues.length == 0}
              <div class="w-3 h-3 rounded-full bg-green-600"></div>
            {/if}
            <div class="flex flex-col gap-1 items-stary">
              <p>
                {sectionToDisplay?.sectionName}
              </p>
              <p class="text-xs text-neutral-700">
                Assigned to: <span class="font-semibold text-black">
                  {sectionToDisplay.assignedTo}
                </span>
              </p>
            </div>
          </div>
          <button aria-label=" " onclick={() => (sectionToDisplay = null)}>
            <i
              class="fa-solid fa-x cursor-pointer hover:text-rose-400 duration-300"
            ></i>
          </button>
        </div>
        <!-- Error part -->
        <div class="flex flex-col p-4">
          <div
            class="{sectionToDisplay?.issues &&
            sectionToDisplay?.issues.length > 0
              ? 'border-rose-400 bg-rose-200'
              : 'border-green-400 bg-green-200'} border p-4 rounded-md mb-8"
          >
            {#if sectionToDisplay?.issues && sectionToDisplay.issues.length > 0}
              <p class="text-rose-600">⚠️ Unresolved issues</p>
              {#each sectionToDisplay.issues as issue (issue.issueDescription)}
                <div class="flex items-center gap-2">
                  <p class="max-w-[75%] w-fit">
                    {issue.issueDescription}
                    ({issue.criticalLevel})
                  </p>
                  <!-- <button class="px-3 py-2 rounded-md border border-lime-200 bg-lime-100 text-lime-700">Resolve</button> -->
                </div>
              {/each}
            {:else}
              <p class="text-green-700">
                <i class="fa-solid fa-face-grin-beam mr-2"></i>
                No issues found.
              </p>
            {/if}
          </div>
          <p class="mb-2">Real-time information</p>
          <div class="flex flex-col gap-4">
            <div
              class="p-3 rounded-md border border-stone-200 bg-white/50 flex items-center gap-3 transition-all hover:border-lime-200 hover:bg-lime-50/50 w-full"
            >
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-lime-100 text-lime-700"
              >
                <i class="fa-solid fa-leaf text-sm"></i>
              </div>
              <div>
                <p
                  class="text-xs font-medium text-stone-400 uppercase tracking-wide"
                >
                  Humidity Level
                </p>
                <p class="text-sm font-bold text-stone-700">
                  {sectionToDisplay?.humidityLevel}
                </p>
              </div>
            </div>
            <div
              class="p-3 rounded-md border border-stone-200 bg-white/50 flex items-center gap-3 transition-all hover:border-lime-200 hover:bg-lime-50/50 w-full"
            >
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-lime-100 text-lime-700"
              >
                <i class="fa-solid fa-leaf text-sm"></i>
              </div>
              <div>
                <p
                  class="text-xs font-medium text-stone-400 uppercase tracking-wide"
                >
                  Temperature
                </p>
                <p class="text-sm font-bold text-stone-700">
                  {sectionToDisplay?.temperature}
                </p>
              </div>
            </div>
            <div
              class="p-3 rounded-md border border-stone-200 bg-white/50 flex items-center gap-3 transition-all hover:border-lime-200 hover:bg-lime-50/50 w-full"
            >
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-lime-100 text-lime-700"
              >
                <i class="fa-solid fa-leaf text-sm"></i>
              </div>
              <div>
                <p
                  class="text-xs font-medium text-stone-400 uppercase tracking-wide"
                >
                  Soil Moisture
                </p>
                <p class="text-sm font-bold text-stone-700">
                  {sectionToDisplay?.soilMoisture}
                </p>
              </div>
            </div>
            <div
              class="p-3 rounded-md border border-stone-200 bg-white/50 flex items-center gap-3 transition-all hover:border-lime-200 hover:bg-lime-50/50 w-full"
            >
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-lime-100 text-lime-700"
              >
                <i class="fa-solid fa-leaf text-sm"></i>
              </div>
              <div>
                <p
                  class="text-xs font-medium text-stone-400 uppercase tracking-wide"
                >
                  Last Watered
                </p>
                <p class="text-sm font-bold text-stone-700">
                  {sectionToDisplay?.lastWatered}
                </p>
              </div>
            </div>
          </div>
          <div class="my-4 mt-8 flex flex-col gap-2">
            <p>Plants in this section</p>
            {#if sectionToDisplay}
              <div class="flex flex-col gap-4">
                {#each sectionToDisplay.plants as plant (plant)}
                  <div
                    class="w-full rounded-md bg-[#f0fdf4] text-black text-sm border-[#baf8cf] border text-neural-600 p-3"
                  >
                    {plant}
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
</section>
