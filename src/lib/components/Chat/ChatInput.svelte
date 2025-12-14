<script lang="ts">
  let { activeChannelLabel, onSendMessage } = $props();
  let draftMessage = $state('');

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (draftMessage.trim()) {
      onSendMessage(draftMessage);
      draftMessage = '';
    }
  }
</script>

<form class="border-t border-stone-100 bg-white px-8 py-5" onsubmit={handleSubmit}>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
    <div class="flex flex-1 items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2 transition-all">
      <button
        class="flex h-9 w-9 items-center justify-center rounded-xl text-stone-400 transition hover:bg-stone-200 hover:text-stone-600"
        type="button"
        aria-label="Attach file"
      >
        <i class="fa-solid fa-paperclip"></i>
      </button>
      <input
        class="flex-1 border-none bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-0"
        type="text"
        placeholder={`Message #${activeChannelLabel}...`}
        bind:value={draftMessage}
      />
    </div>
    <button
      class="rounded-2xl bg-lime-600 px-8 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-lime-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
      type="submit"
      disabled={!draftMessage.trim()}
    >
      Send
    </button>
  </div>
</form>

