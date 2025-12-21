<script lang="ts">
  let { author, isRepeated } = $props();
</script>

<div class="flex h-10 w-10 shrink-0 flex-col items-center">
  {#if !isRepeated}
    <div
      class={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-bold shadow-sm transition-transform group-hover:scale-105`}
    >
      {author
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    </div>
  {/if}
</div>
