<script lang="ts">
  import { enhance } from '$app/forms';
  import type { Snippet } from 'svelte';

  const {
      title,
      action,
      fieldName,
      error,
      success,
      onEnhance,
      children
  }: {
    title: string;
    action: string;
    fieldName: string;
    error?: string;
    success?: string;
    onEnhance: () => any;
    children?: Snippet;
  } = $props();

</script>

<div class="rounded-2xl border border-stone-200 bg-white p-6">
  <h3 class="mb-4 text-sm font-bold text-stone-800">{title}</h3>
  <form {action} method="POST" data-field={fieldName} use:enhance={onEnhance}>
    {@render children?.()}
  </form>

  {#if error}
    <p class="text-red-600 text-sm mt-4">{error}</p>
  {:else if success}
    <p class="text-green-600 text-sm mt-4">{success}</p>
  {/if}
</div>
