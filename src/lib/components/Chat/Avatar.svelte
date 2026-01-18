<script lang="ts">
  const { author, isRepeated } = $props();
</script>

<div class="flex h-10 w-10 shrink-0 flex-col items-center">
  {#if !isRepeated}
    <div
      class={`flex h-10 w-10 items-center justify-center rounded-2xl bg-[${author.avatarColor}] text-xs font-bold  shadow-sm transition-transform group-hover:scale-105`}
    >
      {author.username ? author.username
          .split(' ')
          .map((part) => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(): 'I'}
    </div>
  {/if}
</div>
