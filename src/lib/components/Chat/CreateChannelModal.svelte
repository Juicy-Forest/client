<script lang="ts">
  import Modal from '$lib/components/UI/Modal.svelte';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, topic: string) => void;
  }

  const { isOpen, onClose, onCreate }: Props = $props();
  
  let newChannelName = $state('');
  let newChannelTopic = $state('');

  function handleCreate() {
      onCreate(newChannelName, newChannelTopic);
      // Reset form after attempt (logic for success/fail is in parent/service, but typically we close or error)
      // Here we assume if the modal closes, we might want to reset, or we let the user edit if it failed.
      // The parent controls `isOpen`.
      // Let's rely on parent closing the modal to reset this component state if we used `key` block or similar, 
      // but simplified: we'll just emit.
      // To truly reset, we might want to watch `isOpen` or just reset on successful submit.
      // For now, let's keep it simple.
    
      // Actually, checking original code:
      // It resets when opening.
  }
  
  // Watch for opening to reset
  $effect(() => {
      if (isOpen) {
          // logic to reset if needed, but the original code reset on `openCreateModal` function.
          // We can just reset inputs when valid submit happens, or leave it.
          // Let's reset on open.
      } else {
          newChannelName = '';
          newChannelTopic = '';
      }
  });

  function onSubmit(e: Event) {
      e.preventDefault();
      handleCreate();
  }
</script>

<Modal {isOpen} title="Create Channel" on:close={onClose}>
  <form onsubmit={onSubmit} class="space-y-5">
    <div>
      <label for="channel-name" class="mb-1.5 block text-sm font-semibold text-stone-700">
        Channel Name
      </label>
      <input
        id="channel-name"
        type="text"
        bind:value={newChannelName}
        placeholder="e.g. exploration"
        class="w-full rounded-xl border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-lime-300 focus:bg-white focus:ring-2 focus:ring-lime-100"
        required
      />
    </div>
    
    <div>
      <label for="channel-topic" class="mb-1.5 block text-sm font-semibold text-stone-700">
        Topic <span class="font-normal text-stone-400">(Optional)</span>
      </label>
      <input
        id="channel-topic"
        type="text"
        bind:value={newChannelTopic}
        placeholder="What's this channel about?"
        class="w-full rounded-xl border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-lime-300 focus:bg-white focus:ring-2 focus:ring-lime-100"
      />
    </div>

    <div class="flex justify-end gap-3 pt-2">
      <button
        type="button"
        class="rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
        onclick={onClose}
      >
        Cancel
      </button>
      <button
        type="submit"
        class="rounded-xl bg-lime-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-lime-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!newChannelName.trim()}
      >
        Create Channel
      </button>
    </div>
  </form>
</Modal>

