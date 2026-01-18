<script lang="ts">
  const {
      joinCode
  } = $props<{
    joinCode: string;
  }>();
</script>

<div class="rounded-2xl border border-stone-200 bg-white p-6">
  <h3 class="mb-4 text-sm font-bold text-stone-800">Garden Access Code</h3>
  <p class="text-xs font-medium text-stone-600 mb-2">Share this code with others to let them join your garden:</p>
  <div class="flex items-center gap-2">
    <div class="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-mono text-stone-800">
      {joinCode || 'Loading...'}
    </div>
    <button
      type="button"
      onclick={() => {
          if (joinCode) {
              navigator.clipboard.writeText(joinCode);
          }
      }}
      class="rounded-lg bg-lime-400 px-4 py-2 text-sm font-medium text-stone-800 hover:bg-lime-500 transition-colors"
    >
      Copy
    </button>
  </div>
</div>
