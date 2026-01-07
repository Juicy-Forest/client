<script lang="ts">
  import { page } from "$app/state";

  const { gardenData, isEditMode, onNewSection } = $props();

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
    { tailwindclass: "bg-fuchsia-400" },
  ];


  let selectedColor = $state("");
  let sectionName = $state("");
  let plants = $state("");
  let newSectionErrorMsg = $state("");
  const gardenId = page.url.searchParams.get('gardenId')

  const handleNameChange = (v: string) => (sectionName = v);
  const handlePlantChange = (v: string) => (plants = v);

  const handleCreateSection = async function () {
    if (!selectedColor || !sectionName) {
      newSectionErrorMsg = "Color & Name is required.";
      return;
    }
    newSectionErrorMsg = "";
    const sectionResponse = await fetch("/api/section", {
      method: "POST",
      body: JSON.stringify({
        sectionName,
        plants: plants.split(", "),
        color: selectedColor,
        gardenId: gardenId,
      }),
    headers: {
      "Content-Type": "application/json"
    }});
    const parsedSectionResponse = await sectionResponse.json();
    if (parsedSectionResponse._id) {
      // await invalidate("data:sections");
      onNewSection(parsedSectionResponse)
    } else {
      // Handle err
      console.log(
        "Error trying to create new section:",
        parsedSectionResponse.error
      );
    }
  };
</script>

<div class="rounded-2xl border border-stone-200/60 bg-white/60 p-4">
  <p class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">
    Add Section
  </p>
  
  {#if newSectionErrorMsg}
    <div class="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 border border-red-200">
      <i class="fa-solid fa-circle-exclamation mr-1.5"></i>
      {newSectionErrorMsg}
    </div>
  {/if}
  
  <div class="flex flex-col gap-3">
    <input
      onchange={(e) => handleNameChange((e.target as HTMLInputElement).value || "")}
      value={sectionName}
      class="w-full rounded-xl border border-stone-200 bg-white/80 px-3 py-2.5 text-sm text-stone-800 placeholder-stone-400 transition-all focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/20"
      type="text"
      placeholder="Section name"
    />
    <input
      onchange={(e) => handlePlantChange((e.target as HTMLInputElement).value || "")}
      value={plants}
      class="w-full rounded-xl border border-stone-200 bg-white/80 px-3 py-2.5 text-sm text-stone-800 placeholder-stone-400 transition-all focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/20"
      type="text"
      placeholder="Plants (comma separated)"
    />
    
    <div>
      <p class="text-xs text-stone-500 mb-2">Choose color</p>
      <div class="flex flex-wrap gap-1.5">
        {#each colorOptions as color (color.tailwindclass)}
          <button
            type="button"
            aria-label="Select color"
            onclick={() => (selectedColor = color.tailwindclass)}
            class={`rounded-lg w-6 h-6 cursor-pointer transition-all ${color.tailwindclass} ${
              selectedColor === color.tailwindclass 
                ? 'ring-2 ring-stone-800 ring-offset-2 scale-110' 
                : 'hover:scale-110'
            }`}
          ></button>
        {/each}
      </div>
    </div>
    
    <button
      type="button"
      onclick={() => handleCreateSection()}
      class="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-lime-700"
    >
      <i class="fa-solid fa-plus"></i>
      <span>Create Section</span>
    </button>
  </div>
</div>
