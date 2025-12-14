<script lang="ts">
  import type { Channel } from './types';
  import ChannelItem from './ChannelItem.svelte';

  interface Props {
    channels: Channel[];
    activeChannelId: string;
    onSelectChannel: (id: string) => void;
  }

  let { channels, activeChannelId, onSelectChannel}: Props = $props();
</script>

<aside class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-3xl border border-stone-200/60 bg-white/60 px-5 py-6 shadow-sm backdrop-blur-xl transition-colors hover:bg-white/80">
  <header class="mb-6 flex items-center justify-between px-2">
    <div>
      <p class="text-xs font-bold uppercase tracking-widest text-stone-400">Channels</p>
      <h1 class="mt-1 text-lg font-bold tracking-tight text-stone-800">Camp Atlas</h1>
    </div>
    <button 
      class="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors hover:bg-lime-100 hover:text-lime-700"
      aria-label="Create channel"
    >
      <i class="fa-solid fa-plus text-sm"></i>
    </button>
  </header>

  <nav class="flex-1 overflow-y-auto pr-1">
    <ul class="space-y-2">
      {#each channels as channel}
        <ChannelItem
          {channel}
          isActive={activeChannelId === channel.id}
          on:click={() => onSelectChannel(channel.id)}
        />
      {/each}
    </ul>
  </nav>
</aside>

