<script lang="ts">
  import MessageItem from './MessageItem.svelte';
  import TypingIndicator from './TypingIndicator.svelte';
  import {
      isAtBottom,
      smoothScrollToBottom,
      scrollToBottomInstant,
  } from '$lib/utils/scroll';
  import type { ChatService } from '$lib/services/chat.svelte';
  import { getContext } from 'svelte';

  const chat: ChatService = getContext('chatService');

  const messages: any[] = $derived(
      chat.messages.filter(
          (message) => message.channelId === chat.activeChannelId,
      ),
  );

  let scrollContainer: HTMLDivElement;

  $effect(() => {
      const channelId = chat.activeChannelId;
      scrollToBottomInstant(scrollContainer);
  });

  $effect(() => {
      const count = messages.length;
      const typingCount = chat.peopleTyping.length;

      if ((count > 0 || typingCount > 0) && scrollContainer) {
          const shouldScroll = isAtBottom(scrollContainer);

          if (shouldScroll) {
              smoothScrollToBottom(scrollContainer);
          }
      }
  });
</script>

<div bind:this={scrollContainer} class="flex-1 overflow-y-auto px-8 py-6">
  <div class="flex flex-col">
    {#if chat.channels.length === 0}
      <div
        class="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-stone-200 bg-stone-50/50 px-6 py-12 text-center text-sm text-stone-500"
      >
        <div class="rounded-full bg-stone-100 p-3 text-stone-400">
          <i class="fa-regular fa-comments text-xl"></i>
        </div>
        <p>No channels yet. Create one to start chatting!</p>
      </div>
    {:else if messages.length === 0}
      <div
        class="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-stone-200 bg-stone-50/50 px-6 py-12 text-center text-sm text-stone-500"
      >
        <div class="rounded-full bg-stone-100 p-3 text-stone-400">
          <i class="fa-regular fa-comments text-xl"></i>
        </div>
        <p>No messages yet. Start the conversation!</p>
      </div>
    {:else}
      {#each messages as message, i}
        {@const isRepeated =
          i > 0 && messages[i - 1].author.username === message.author.username}
        <MessageItem
          {message}
          isSelf={message.author._id === chat.userData._id}
          {isRepeated}
        />
      {/each}
    {/if}
    <TypingIndicator peopleTyping={chat.peopleTyping} />
  </div>
</div>
