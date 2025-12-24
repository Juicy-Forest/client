<script lang="ts">
  import type { Channel } from './types';
  import { createEventDispatcher } from 'svelte';

  export let channel: Channel;
  export let isActive: boolean = false;

  const dispatch = createEventDispatcher();
</script>

<li>
  <button
    class={`group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${
      isActive
        ? 'bg-lime-100/50 text-lime-900 shadow-sm ring-1 ring-lime-200/50'
        : 'text-stone-500 hover:bg-stone-100/50 hover:text-stone-700'
    }`}
    on:click={() => dispatch('click')}
  >
    <div class="flex flex-col text-left">
      <span
        class={`font-semibold ${isActive ? 'text-lime-950' : 'text-stone-700 group-hover:text-stone-900'}`}
      >
        #{channel.label}
      </span>
      <span class="text-xs opacity-70">{channel.topic}</span>
    </div>
    {#if channel.unread}
      <span
        class="rounded-full bg-lime-200 px-2 py-0.5 text-[10px] font-bold text-lime-800 shadow-sm"
      >
        {channel.unread}
      </span>
    {/if}
  </button>
</li>




