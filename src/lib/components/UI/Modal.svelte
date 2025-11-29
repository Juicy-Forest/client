<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  export let isOpen: boolean = false;
  export let title: string = '';

  const dispatch = createEventDispatcher();

  const close = () => {
    dispatch('close');
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (isOpen && e.key === 'Escape') {
      close();
    }
  };
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/20 backdrop-blur-sm transition-all"
    on:click|self={close}
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 200 }}
    role="presentation"
  >
    <!-- Modal Panel -->
    <div
      class="w-full max-w-md scale-100 transform overflow-hidden rounded-[2rem] border border-stone-100 bg-white p-8 text-left align-middle shadow-xl transition-all focus:outline-none"
      in:scale={{ start: 0.95, duration: 200 }}
      out:scale={{ start: 0.95, duration: 200 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabindex="-1"
    >
      <header class="mb-6 flex items-center justify-between">
        <h3 id="modal-title" class="text-xl font-bold leading-6 text-stone-900">{title}</h3>
        <button
          class="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
          on:click={close}
          aria-label="Close"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </header>

      <div class="mt-2">
        <slot />
      </div>
    </div>
  </div>
{/if}
