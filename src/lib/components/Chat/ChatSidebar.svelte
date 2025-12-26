<script lang="ts">
  import ChannelItem from "./ChannelItem.svelte";

  interface Props {
    channels: any[];
    activeChannelId: string;
    onSelectChannel: (id: string) => void;
    createChannel?: (name: string, gardenId: string) => void;
    gardenId: string;
  }

  let { channels, activeChannelId, onSelectChannel, createChannel, gardenId}: Props = $props();

  function handleCreateChannel(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("channelName") as string;

    if (name?.trim() && createChannel) {
      createChannel(name.trim(), gardenId);
      (e.target as HTMLFormElement).reset(); 
    }
  }
</script>

<aside
  class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-3xl border border-stone-200/60 bg-white/60 px-5 py-6 shadow-sm backdrop-blur-xl transition-colors hover:bg-white/80"
>
  <header class="mb-6">
    <div class="mb-4 px-2">
      <p class="text-xs font-bold uppercase tracking-widest text-stone-400">
        Channels
      </p>
      <h1 class="mt-1 text-lg font-bold tracking-tight text-stone-800">
        Camp Atlas
      </h1>
    </div>
    <form onsubmit={handleCreateChannel} class="flex w-full gap-2">
      <input
        type="text"
        name="channelName"
        placeholder="New channel..."
        required
        class="flex-1 min-w-0 rounded-lg border border-stone-200 bg-white/80 px-3 py-2 text-sm text-stone-800 placeholder-stone-400 transition-colors focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/20"
      />
      <button
        type="submit"
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lime-600 text-white transition-colors hover:bg-lime-700"
        aria-label="Create channel"
      >
        <i class="fa-solid fa-plus text-sm"></i>
      </button>
    </form>
  </header>

  <nav class="flex-1 overflow-y-auto pr-1">
    <ul class="space-y-2">
      {#if channels}
      {#each channels as channel}
        <ChannelItem
          {channel}
          isActive={activeChannelId === channel._id}
          clickHandler={() => onSelectChannel(channel._id)}
        />
      {/each}
      {/if}
    </ul>
  </nav>
</aside>
