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
      <h2 class="text-lg font-bold text-stone-800">#{activeChannel.name}</h2>
    </div>
  </div>
  <!-- <div class="flex items-center gap-3 text-xs font-medium text-stone-500"> -->
  <!--   <div class="flex -space-x-2"> -->
  <!--     {#each activeMembers.slice(0, 4) as member} -->
  <!--       <div class={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-sm ring-1 ring-stone-100 ${member.avatarColor}`}> -->
  <!--         {member.initials} -->
  <!--       </div> -->
  <!--     {/each} -->
  <!--   </div> -->
  <!--   <span class="ml-1 rounded-full bg-stone-100 px-2.5 py-1">{activeMembers.length} active</span> -->
  <!-- </div> -->
</header>

