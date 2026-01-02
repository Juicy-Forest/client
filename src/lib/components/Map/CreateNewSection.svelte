<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { globalData, isEditMode } from "$lib/state/data";

  let gardenData = $derived($globalData.gardenDataState)
  
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
        gardenId: gardenData ? gardenData[0]._id : "", // think of fix, gardenData will always exist
      }),
    });
    const parsedSectionResponse = await sectionResponse.json();
    console.log(parsedSectionResponse)
    if (parsedSectionResponse._id) {
      globalData.update(d => {
       console.log("DATA:", d) 
       console.log("New section:", [...d.sectionDataState, parsedSectionResponse])
      return ({
        ...d,
        sectionDataState: [...d.sectionDataState, parsedSectionResponse]})
      }
      );
    } else {
      // Handle err
      console.log(
        "Error trying to create new section:",
        parsedSectionResponse.error
      );
    }
  };
</script>

<div class="">
  <p class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">
    Add section
  </p>
  <p class="text-xs text-rose-400 font-semibold mb-1">
    {newSectionErrorMsg}
  </p>
  <div class="w-full flex flex-col items-start gap-2 px-1">
    <input
      onchange={(e) =>
        handleNameChange((e.target as HTMLInputElement).value || "")}
      value={sectionName}
      class="p-2 w-full rounded-md bg-none placeholder:text-xs text-black/80 border border-black/30"
      type="text"
      placeholder="Section name"
    />
    <input
      onchange={(e) =>
        handlePlantChange((e.target as HTMLInputElement).value || "")}
      value={plants}
      class="p-2 w-full rounded-md bg-none outline-none text-black/80 border placeholder:text-xs border-black/30"
      type="text"
      placeholder="Plants (comma separated)"
    />
    <div class="flex flex-wrap gap-1 w-full h-fit">
      {#each colorOptions as color (color.tailwindclass)}
        <button
          aria-label=" "
          onclick={() => (selectedColor = color.tailwindclass)}
          class="rounded-md w-5 h-5 cursor-pointer {color.tailwindclass} {selectedColor ===
            color.tailwindclass && 'border border-black'}"
        ></button>
      {/each}
    </div>
    <button
      onclick={() => handleCreateSection()}
      class={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${$isEditMode ? "bg-amber-100 text-amber-800 ring-1 ring-amber-200" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
    >
      <i class="fa-solid fa-pen"></i>
      <span>Create Section</span>
    </button>
  </div>
</div>
