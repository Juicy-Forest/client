<script lang="ts">
  import Modal from "$lib/components/util/Modal.svelte";

  let { isOpen, onConfirm, onCancel } = $props();
</script>

<Modal {isOpen} close={onCancel} title="Unsend Message">
  <div class="flex flex-col gap-5">
    <div class="flex flex-col gap-3">
      <p class="text-stone-700">
        Are you sure you want to unsend this message?
      </p>
      <p class="flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
        <i class="fa-solid fa-triangle-exclamation mt-0.5 text-amber-500"></i>
        <span>Some people may have already seen this message.</span>
      </p>
    </div>

    <div class="flex justify-end gap-3">
      <button
        type="button"
        onclick={onCancel}
        class="rounded-xl px-5 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
      >
        Cancel
      </button>
      <button
        type="button"
        onclick={onConfirm}
        class="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
      >
        Unsend
      </button>
    </div>
  </div>
</Modal>

