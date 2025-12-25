<script lang="ts">
  import TypingDots from "./TypingDots.svelte";

  let { peopleTyping = [] }: { peopleTyping: string[] } = $props();
</script>

{#if peopleTyping.length > 0}
  <div class="group mt-5 flex gap-5">
    <!-- Avatars of people typing -->
    <div class="flex h-10 w-10 shrink-0 flex-col items-center">
      <div class="flex -space-x-6">
        {#each peopleTyping as person}
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-xs font-bold text-stone-700 shadow-sm ring ring-stone-900/5 transition-transform hover:scale-105"
            title={person}
          >
            {person
              .split(" ")
              .map((part: string) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        {/each}
      </div>
    </div>

    <!-- Animated typing indicator -->
    <TypingDots />
  </div>
{/if}

