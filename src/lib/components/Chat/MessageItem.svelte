<script lang="ts">
  import type { Message } from './types';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let message: Message;
  export let isSelf: boolean = false;
  export let isRepeated: boolean = false;
</script>

<article 
  class={`group flex gap-5 ${isSelf ? 'flex-row-reverse' : ''} ${isRepeated ? 'mt-1' : 'mt-5'}`}
  in:fly={{ y: 20, duration: 300, easing: cubicOut }}
>
  <!-- Avatar - Hidden for repeated messages but keeps spacing -->
  <div class="flex h-10 w-10 shrink-0 flex-col items-center">
    {#if !isRepeated}
      <div
        class={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-bold shadow-sm transition-transform group-hover:scale-105 ${message.author.avatarColor}`}
      >
        {message.author.name
          .split(' ')
          .map((part) => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()}
      </div>
    {/if}
  </div>

  <div class={`flex max-w-[85%] flex-1 flex-col ${isSelf ? 'items-end' : ''}`}>
    {#if !isRepeated}
      <header class={`flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm ${isSelf ? 'flex-row-reverse' : ''}`}>
        <p class={`font-bold ${message.author.color}`}>{message.author.name}</p>
        <span
          class="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-500"
          >{message.author.role}</span
        >
        <span class="text-xs text-stone-400">{message.timestamp}</span>
      </header>
    {/if}
    
    <div
      class={`inline-block rounded-2xl border px-6 py-3.5 text-[15px] leading-relaxed shadow-sm
        ${isRepeated ? 'mt-0.5' : 'mt-2'}
        ${isSelf 
          ? `border-lime-200 bg-lime-50 text-stone-800 ring-1 ring-lime-900/5 ${isRepeated ? 'rounded-r-md' : 'rounded-tr-sm'}` 
          : `border-stone-100 bg-white text-stone-700 ring-1 ring-stone-900/5 ${isRepeated ? 'rounded-l-md' : 'rounded-tl-sm'}`
        }`}
    >
      {message.content}
    </div>
  </div>
</article>
