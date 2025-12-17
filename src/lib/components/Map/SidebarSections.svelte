<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { globalData, isEditMode, selectedSectionId } from "$lib/state/data";
  import type { SectionInfo } from "$lib/types/section";

    let sectionData = $derived($globalData.sectionDataState)

   const handleDeleteSection = async function (id: string) {
    const deleteSectionResponse = await fetch(`/api/section/${id}`, {
      method: "DELETE",
    });
    const parsedRes = await deleteSectionResponse.json();
    console.log(parsedRes)
    if (parsedRes.status === 500) {
      // handle error message, (use toastify for errors)
      return;
    }
    globalData.update((d) => ({
      ...d,
      sectionDataState: d.sectionDataState.filter((section: SectionInfo) => section._id !== id)
    }))
    await invalidate("data:sections");
  };

</script>

<div class="flex flex-col w-full gap-1">
  <p class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">
    Available Sections
  </p>
  <!-- idk what this is, VScode suggested quick fix, otherwise underlined yellow -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  {#each sectionData as section (section._id)}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      onclick={() => {
        if($isEditMode) {
          selectedSectionId.set(section._id)
        }
      }
        }
      class={`w-full p-2 flex items-center justify-between cursor-pointer
       border-gray-200 border rounded-md ${$selectedSectionId && (($selectedSectionId ===
        section._id) && 'font-semibold')} ${section.color}`}
    >
      <p>{section.sectionName}</p>
      <button
        aria-label=" "
        onclick={() => handleDeleteSection(section._id)}
        class="border active:scale-[0.7] transform duration-200 border-gray-300 text-gray-700 flex items-center justify-center w-5 h-5 rounded-md cursor-pointer bg-gray-100"
      >
        <i class="fa-solid fa-x scale-[0.5]"></i>
      </button>
    </div>
  {/each}
</div>
