<script lang="ts">
  const { content, isEdited = false } = $props();
</script>

<p>{content}</p>
{#if isEdited}
  <span class="ml-1 text-xs text-stone-400 italic">(edited)</span>
{/if}

