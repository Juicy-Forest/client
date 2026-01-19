<script lang="ts">
  const { initialContent, onSave, onCancel } = $props();
  
  let content = $state(initialContent);
  let textareaEl: HTMLTextAreaElement;

  // Auto-focus when mounted
  $effect(() => {
      textareaEl?.focus();
  });

  function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSave();
      }
      if (e.key === 'Escape') {
          onCancel();
      }
  }

  function handleSave() {
      const trimmed = content.trim();
      if (trimmed && trimmed !== initialContent) {
          onSave(trimmed);
      } else {
          onCancel();
      }
  }
</script>

<div class="flex flex-col gap-2">
  <textarea
    bind:this={textareaEl}
    bind:value={content}
    onkeydown={handleKeydown}
    rows="2"
    class="w-full resize-none rounded-xl border border-lime-300 bg-lime-50 px-4 py-3 text-[15px] leading-relaxed text-stone-800 focus:outline-none focus:ring-2 focus:ring-lime-400"
  ></textarea>
  
  <div class="flex items-center gap-3 text-xs">
    <button
      type="button"
      onclick={handleSave}
      class="font-medium text-lime-600 hover:text-lime-700 hover:underline"
    >
      Save
    </button>
    <button
      type="button"
      onclick={onCancel}
      class="text-stone-500 hover:text-stone-600 hover:underline"
    >
      Cancel
    </button>
    <span class="text-stone-400">
      Enter to save · Esc to cancel
    </span>
  </div>
</div>

