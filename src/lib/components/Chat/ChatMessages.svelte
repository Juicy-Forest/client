<script lang="ts">
  import type { Message } from './types';
  import MessageItem from './MessageItem.svelte';

  let { messages , userId } = $props();
</script>

<div class="flex-1 overflow-y-auto px-8 py-6">
  <div class="flex flex-col">
    {#if messages.length === 0}
      <div class="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-stone-200 bg-stone-50/50 px-6 py-12 text-center text-sm text-stone-500">
        <div class="rounded-full bg-stone-100 p-3 text-stone-400">
          <i class="fa-regular fa-comments text-xl"></i>
        </div>
        <p>No messages yet. Start the conversation!</p>
      </div>
    {:else}
      {#each messages as message, i}
        {@const isRepeated = i > 0 && messages[i - 1].author.username === message.author.username}
        <MessageItem 
          {message} 
          isSelf={message.author._id === userId} 
          {isRepeated}
        />
      {/each}
    {/if}
  </div>
</div>

