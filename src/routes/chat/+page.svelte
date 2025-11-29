<script lang="ts">
  type Channel = {
    id: string;
    label: string;
    topic: string;
    unread?: number;
  };

  type Message = {
    id: string;
    author: {
      name: string;
      role: string;
      color: string;
      avatarColor: string;
    };
    timestamp: string;
    content: string;
  };

  const channels: Channel[] = [
    { id: 'general', label: 'general', topic: 'Announcements & hangouts', unread: 3 },
    { id: 'expeditions', label: 'expeditions', topic: 'Field coordination & reports' },
    { id: 'lab-notes', label: 'lab-notes', topic: 'Research documentation & drafts' },
    { id: 'supplies', label: 'supplies', topic: 'Requests & inventory updates', unread: 1 }
  ];

  const messages: Record<string, Message[]> = {
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
  };

  let activeChannelId = channels[0].id;
  let draftMessage = '';

  const setActiveChannel = (channelId: string) => {
    activeChannelId = channelId;
  };

  const handleSend = () => {
    draftMessage = '';
  };

  $: activeChannel = channels.find((channel) => channel.id === activeChannelId) ?? channels[0];
  $: activeMessages = messages[activeChannelId] ?? [];
  $: activeMembers = Array.from(
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
  );
</script>

<section class="box-border min-h-screen bg-[#fdfcf8] px-4 pb-8 pt-36 text-stone-800 sm:px-8 lg:px-12">
  <div class="mx-auto grid w-full max-w-none items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
    
    <!-- Sidebar -->
    <aside class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-3xl border border-stone-200/60 bg-white/60 px-5 py-6 shadow-sm backdrop-blur-xl transition-colors hover:bg-white/80">
      <header class="mb-6 px-2">
        <p class="text-xs font-bold uppercase tracking-widest text-stone-400">Channels</p>
        <h1 class="mt-1 text-lg font-bold tracking-tight text-stone-800">Camp Atlas</h1>
      </header>

      <nav class="flex-1 overflow-y-auto pr-1">
        <ul class="space-y-2">
          {#each channels as channel}
            <li>
              <button
                class={`group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${
                  activeChannelId === channel.id
                    ? 'bg-lime-100/50 text-lime-900 shadow-sm ring-1 ring-lime-200/50'
                    : 'text-stone-500 hover:bg-stone-100/50 hover:text-stone-700'
                }`}
                on:click={() => setActiveChannel(channel.id)}
              >
                <div class="flex flex-col text-left">
                  <span class={`font-semibold ${activeChannelId === channel.id ? 'text-lime-950' : 'text-stone-700 group-hover:text-stone-900'}`}>
                    #{channel.label}
                  </span>
                  <span class="text-xs opacity-70">{channel.topic}</span>
                </div>
                {#if channel.unread}
                  <span class="rounded-full bg-lime-200 px-2 py-0.5 text-[10px] font-bold text-lime-800 shadow-sm">
                    {channel.unread}
                  </span>
                {/if}
              </button>
            </li>
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
          <div class="space-y-8">
            {#if activeMessages.length === 0}
              <div class="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-stone-200 bg-stone-50/50 px-6 py-12 text-center text-sm text-stone-500">
                <div class="rounded-full bg-stone-100 p-3 text-stone-400">
                  <i class="fa-regular fa-comments text-xl"></i>
                </div>
                <p>No messages yet. Start the conversation!</p>
              </div>
            {:else}
              {#each activeMessages as message}
                <article class="group flex gap-5">
                  <div class={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-bold shadow-sm transition-transform group-hover:scale-105 ${message.author.avatarColor}`}>
                    {message.author.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div class="max-w-[85%] flex-1">
                    <header class="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
                      <p class={`font-bold ${message.author.color}`}>{message.author.name}</p>
                      <span class="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-500">{message.author.role}</span>
                      <span class="text-xs text-stone-400">{message.timestamp}</span>
                    </header>
                    <div class="mt-2 inline-block rounded-2xl rounded-tl-sm border border-stone-100 bg-white px-6 py-3.5 text-[15px] leading-relaxed text-stone-700 shadow-sm ring-1 ring-stone-900/5">
                      {message.content}
                    </div>
                  </div>
                </article>
              {/each}
            {/if}
          </div>
        </div>

        <!-- Input -->
        <form class="border-t border-stone-100 bg-white px-8 py-5" on:submit|preventDefault={handleSend}>
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
</section>
