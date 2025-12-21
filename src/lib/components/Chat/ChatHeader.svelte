<script lang="ts">
  import type { Channel } from './types';

  interface Props {
    activeChannel: Channel;
  }

  let { activeChannel }: Props = $props();
</script>

<header class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-white/50 px-8 py-5 backdrop-blur-sm">
  <div>
    <div class="flex items-center gap-2">
      <span class="flex h-2 w-2 rounded-full bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.5)]"></span>
      <h2 class="text-lg font-bold text-stone-800">#{activeChannel.label}</h2>
    </div>
    <p class="mt-0.5 text-sm text-stone-500">{activeChannel.topic}</p>
  </div>
  <div class="flex items-center gap-3 text-xs font-medium text-stone-500">
  </div>
</header>

