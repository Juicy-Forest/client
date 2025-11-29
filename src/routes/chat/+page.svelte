<script lang="ts">
  import type { Channel, Message } from '$lib/components/Chat/types';
  import ChannelItem from '$lib/components/Chat/ChannelItem.svelte';
  import MessageItem from '$lib/components/Chat/MessageItem.svelte';
  import Modal from '$lib/components/UI/Modal.svelte';

  let channels: Channel[] = $state([
    { id: 'general', label: 'general', topic: 'Announcements & hangouts', unread: 3 },
    { id: 'expeditions', label: 'expeditions', topic: 'Field coordination & reports' },
    { id: 'lab-notes', label: 'lab-notes', topic: 'Research documentation & drafts' },
    { id: 'supplies', label: 'supplies', topic: 'Requests & inventory updates', unread: 1 }
  ]);

  let messages: Record<string, Message[]> = $state({
    general: [
      {
        id: 'm1',
        author: {
          name: 'Maya',
          role: 'Coordinator',
          color: 'text-emerald-700',
          avatarColor: 'bg-emerald-100 text-emerald-700'
        },
        timestamp: '09:42',
        content: 'Morning update: camp cleared and briefing starts in 15 minutes.'
      },
      {
        id: 'm2',
        author: {
          name: 'Noah',
          role: 'Logistics',
          color: 'text-teal-700',
          avatarColor: 'bg-teal-100 text-teal-700'
        },
        timestamp: '09:44',
        content: 'Weather report attached in the docs folder. Expect light rain after 18:00.'
      }
    ],
    expeditions: [
      {
        id: 'm3',
        author: {
          name: 'Ari',
          role: 'Scout Lead',
          color: 'text-lime-700',
          avatarColor: 'bg-lime-100 text-lime-700'
        },
        timestamp: '08:13',
        content: 'Route Bravo is flagged due to fallen trees. Re-routing team to Delta path.'
      }
    ],
    'lab-notes': [
      {
        id: 'm4',
        author: {
          name: 'Dr. Chen',
          role: 'Research',
          color: 'text-green-800',
          avatarColor: 'bg-green-100 text-green-800'
        },
        timestamp: '07:55',
        content: 'Sample batch 12B is stable. Uploading observations to the shared notebook.'
      }
    ],
    supplies: [
      {
        id: 'm5',
        author: {
          name: 'Ivy',
          role: 'Quartermaster',
          color: 'text-cyan-700',
          avatarColor: 'bg-cyan-100 text-cyan-700'
        },
        timestamp: '10:02',
        content: 'Need confirmation on bio-filters by noon so we can add them to the convoy manifest.'
      }
    ]
  });

  let activeChannelId = $state('');
  let showCreateModal = $state(false);
  let newChannelName = $state('');
  let newChannelTopic = $state('');

  $effect(() => {
    if (!activeChannelId && channels.length > 0) {
      activeChannelId = channels[0].id;
    }
  });
  let draftMessage = $state('');

  const setActiveChannel = (channelId: string) => {
    activeChannelId = channelId;
  };

  const handleSend = () => {
    if (!draftMessage.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      author: {
        name: 'You',
        role: 'Team Member',
        color: 'text-stone-800',
        avatarColor: 'bg-stone-200 text-stone-600'
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: draftMessage
    };

    if (!messages[activeChannelId]) {
      messages[activeChannelId] = [];
    }

    messages[activeChannelId] = [...messages[activeChannelId], newMessage];
    draftMessage = '';
  };

  const openCreateModal = () => {
    newChannelName = '';
    newChannelTopic = '';
    showCreateModal = true;
  };

  const closeCreateModal = () => {
    showCreateModal = false;
  };

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      const id = newChannelName.toLowerCase().replace(/\s+/g, '-');
      if (channels.some((c) => c.id === id)) {
        alert('Channel already exists!');
        return;
      }
      
      const newChannel: Channel = {
        id,
        label: newChannelName,
        topic: newChannelTopic || 'New channel',
      };
      
      channels = [...channels, newChannel];
      messages[id] = [];
      setActiveChannel(id);
      closeCreateModal();
    }
  };

  let activeChannel = $derived(channels.find((channel) => channel.id === activeChannelId) ?? channels[0]);
  let activeMessages = $derived(messages[activeChannelId] ?? []);
  let activeMembers = $derived(Array.from(
    activeMessages.reduce((map, message) => {
      if (!map.has(message.author.name)) {
        map.set(message.author.name, {
          name: message.author.name,
          avatarColor: message.author.avatarColor,
          initials: message.author.name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
        });
      }
      return map;
    }, new Map()).values()
  ));
</script>

<section class="box-border min-h-screen bg-[#fdfcf8] px-4 pb-8 pt-36 text-stone-800 sm:px-8 lg:px-12">
  <div class="mx-auto grid w-full max-w-none items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
    
    <!-- Sidebar -->
    <aside class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-3xl border border-stone-200/60 bg-white/60 px-5 py-6 shadow-sm backdrop-blur-xl transition-colors hover:bg-white/80">
      <header class="mb-6 flex items-center justify-between px-2">
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-stone-400">Channels</p>
          <h1 class="mt-1 text-lg font-bold tracking-tight text-stone-800">Camp Atlas</h1>
        </div>
        <button 
          class="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors hover:bg-lime-100 hover:text-lime-700"
          onclick={openCreateModal}
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
              on:click={() => setActiveChannel(channel.id)}
            />
          {/each}
        </ul>
      </nav>
    </aside>

    <!-- Chat Area -->
    <div class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-white/80 shadow-xl shadow-stone-200/20 backdrop-blur-xl">
      
      <!-- Header -->
      <header class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-white/50 px-8 py-5 backdrop-blur-sm">
        <div>
          <div class="flex items-center gap-2">
            <span class="flex h-2 w-2 rounded-full bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.5)]"></span>
            <h2 class="text-lg font-bold text-stone-800">#{activeChannel.label}</h2>
          </div>
          <p class="mt-0.5 text-sm text-stone-500">{activeChannel.topic}</p>
        </div>
        <div class="flex items-center gap-3 text-xs font-medium text-stone-500">
          <div class="flex -space-x-2">
            {#each activeMembers.slice(0, 4) as member}
              <div class={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-sm ring-1 ring-stone-100 ${member.avatarColor}`}>
                {member.initials}
              </div>
            {/each}
          </div>
          <span class="ml-1 rounded-full bg-stone-100 px-2.5 py-1">{activeMembers.length} active</span>
        </div>
      </header>

      <!-- Messages -->
      <div class="flex flex-1 flex-col overflow-hidden bg-stone-50/30">
        <div class="flex-1 overflow-y-auto px-8 py-6">
          <div class="flex flex-col">
            {#if activeMessages.length === 0}
              <div class="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-stone-200 bg-stone-50/50 px-6 py-12 text-center text-sm text-stone-500">
                <div class="rounded-full bg-stone-100 p-3 text-stone-400">
                  <i class="fa-regular fa-comments text-xl"></i>
                </div>
                <p>No messages yet. Start the conversation!</p>
              </div>
            {:else}
              {#each activeMessages as message, i}
                {@const isRepeated = i > 0 && activeMessages[i - 1].author.name === message.author.name}
                <MessageItem 
                  {message} 
                  isSelf={message.author.name === 'You'} 
                  {isRepeated}
                />
              {/each}
            {/if}
          </div>
        </div>

        <!-- Input -->
        <form class="border-t border-stone-100 bg-white px-8 py-5" onsubmit={(e) => { e.preventDefault(); handleSend(); }}>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div class="flex flex-1 items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2 transition-all">
              <button
                class="flex h-9 w-9 items-center justify-center rounded-xl text-stone-400 transition hover:bg-stone-200 hover:text-stone-600"
                type="button"
                aria-label="Attach file"
              >
                <i class="fa-solid fa-paperclip"></i>
              </button>
              <input
                class="flex-1 border-none bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-0"
                type="text"
                placeholder={`Message #${activeChannel.label}...`}
                bind:value={draftMessage}
              />
            </div>
            <button
              class="rounded-2xl bg-lime-600 px-8 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-lime-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={!draftMessage.trim()}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Create Channel Modal -->
  <Modal isOpen={showCreateModal} title="Create Channel" on:close={closeCreateModal}>
    <form onsubmit={(e) => { e.preventDefault(); handleCreateChannel(); }} class="space-y-5">
      <div>
        <label for="channel-name" class="mb-1.5 block text-sm font-semibold text-stone-700">
          Channel Name
        </label>
        <input
          id="channel-name"
          type="text"
          bind:value={newChannelName}
          placeholder="e.g. exploration"
          class="w-full rounded-xl border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-lime-300 focus:bg-white focus:ring-2 focus:ring-lime-100"
          required
        />
      </div>
      
      <div>
        <label for="channel-topic" class="mb-1.5 block text-sm font-semibold text-stone-700">
          Topic <span class="font-normal text-stone-400">(Optional)</span>
        </label>
        <input
          id="channel-topic"
          type="text"
          bind:value={newChannelTopic}
          placeholder="What's this channel about?"
          class="w-full rounded-xl border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-lime-300 focus:bg-white focus:ring-2 focus:ring-lime-100"
        />
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <button
          type="button"
          class="rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
          onclick={closeCreateModal}
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-xl bg-lime-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-lime-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!newChannelName.trim()}
        >
          Create Channel
        </button>
      </div>
    </form>
  </Modal>
</section>
