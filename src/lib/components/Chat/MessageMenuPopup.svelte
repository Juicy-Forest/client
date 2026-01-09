<script lang="ts">
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  let { timestamp, onEdit, onUnsend, onClose } = $props();
  
  let popupEl: HTMLDivElement;
  let openAbove = $state(true);

  // Check available space and position popup accordingly
  $effect(() => {
    if (popupEl) {
      const rect = popupEl.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      
      // If positioned above but not enough space, flip to below
      // If positioned below but not enough space, flip to above
      const popupHeight = rect.height;
      
      if (openAbove && spaceAbove < popupHeight && spaceBelow > popupHeight) {
        openAbove = false;
      } else if (!openAbove && spaceBelow < popupHeight && spaceAbove > popupHeight) {
        openAbove = true;
      }
    }
  });

  function formatDateTime(ts: string) {
    const date = new Date(ts);
    return date.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Backdrop -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="fixed inset-0 z-40" onclick={handleBackdropClick}></div>

<!-- Popup -->
<div
  bind:this={popupEl}
  class="absolute right-0 z-50 min-w-48 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg ring-1 ring-stone-900/5
    {openAbove ? 'bottom-full mb-1' : 'top-full mt-1'}"
  transition:fly={{ y: openAbove ? 8 : -8, duration: 150, easing: cubicOut }}
>
  <!-- Timestamp header -->
  <div class="border-b border-stone-100 bg-stone-50 px-4 py-2.5">
    <p class="text-xs font-medium text-stone-500">Sent</p>
    <p class="text-sm text-stone-700">{formatDateTime(timestamp)}</p>
  </div>

  <!-- Actions -->
  <div class="flex flex-col p-1.5">
    <button
      type="button"
      onclick={onEdit}
      class="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-stone-700 transition-colors hover:bg-stone-100"
    >
      <i class="fa-solid fa-pen text-stone-400"></i>
      <span>Edit</span>
    </button>

    <button
      type="button"
      onclick={onUnsend}
      class="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
    >
      <i class="fa-solid fa-trash-can text-red-400"></i>
      <span>Unsend</span>
    </button>
  </div>
</div>


