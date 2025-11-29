<script>
    import Construction from "$lib/components/Construction.svelte";

    // Placeholder
    let user = "Jon Snow"
    let sectionInfo = [
        {
            assignedTo: 'Tyrion',
            sectionName: "Section A - Vegetables",
            issue: false
        },
        {
            assignedTo: 'Jon',
            sectionName: "Section B - Herbs",
            issue: true
        },
        {
            assignedTo: 'Marco Polo',
            sectionName: "Section C - Fruits",
            issue: false
        },
        {
            assignedTo: 'Tyrell',
            sectionName: "Section D - Flowers",
            issue: false
        },
    ]

    let generalInformation = [
        {
            statName: "Temperature",
            statValue: "23°C"
        },
        {
            statName: "Humidity",
            statValue: "18%"
        },
        {
            statName: "Last watered",
            statValue: "2 hours ago"
        },
    ]
</script>

<section class="box-border min-h-screen bg-[#fdfcf8] px-4 pb-8 pt-12 text-stone-800 sm:px-8 lg:px-12">
  <div class="mx-auto grid w-full max-w-none items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
    
    <!-- Sidebar -->
    <aside class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-3xl border border-stone-200/60 bg-white/60 px-5 py-6 shadow-sm backdrop-blur-xl transition-colors hover:bg-white/80">
      <header class="mb-6 px-2">
        <p class="text-xs font-bold uppercase tracking-widest text-stone-400">Overview</p>
        <h1 class="mt-1 text-lg font-bold tracking-tight text-stone-800">Garden Stats</h1>
      </header>

      <div class="flex-1 overflow-y-auto pr-1">
        <div class="flex flex-col gap-3">
            {#each generalInformation as stats (stats.statName)}
                <div class="p-3 rounded-2xl border border-stone-200 bg-white/50 flex items-center gap-3 transition-all hover:border-lime-200 hover:bg-lime-50/50">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-lime-100 text-lime-700">
                        <i class="fa-solid fa-leaf text-sm"></i>
                    </div>
                    <div>
                        <p class="text-xs font-medium text-stone-400 uppercase tracking-wide">{stats.statName}</p>
                        <p class="text-sm font-bold text-stone-700">{stats.statValue}</p>
                    </div>
                </div>
            {/each}
        </div>
        
        <div class="mt-8 px-2">
            <p class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Status Key</p>
            <div class="space-y-2">
                <div class="flex items-center gap-2">
                    <div class="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                    <span class="text-sm text-stone-600">Good Condition</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.4)]"></div>
                    <span class="text-sm text-stone-600">Requires Attention</span>
                </div>
            </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-white/80 shadow-xl shadow-stone-200/20 backdrop-blur-xl">
      
      <!-- Header -->
      <header class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-white/50 px-8 py-5 backdrop-blur-sm">
        <div>
          <h2 class="text-lg font-bold text-stone-800">Greetings, {user}</h2>
          <p class="mt-0.5 text-sm text-stone-500">Here's your daily garden overview.</p>
        </div>
        <button class="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600 transition-all hover:bg-stone-50 hover:text-stone-800 hover:border-stone-300 shadow-sm">
            <i class="fa-solid fa-gear text-stone-400"></i>
            <span>Settings</span>
        </button>
      </header>

      <!-- Content -->
      <div class="flex flex-1 flex-col overflow-hidden bg-stone-50/30">
        <div class="flex-1 overflow-hidden px-8 py-6">
            <div class="relative h-full w-full overflow-hidden rounded-3xl border border-stone-200 shadow-lg">
                <img src="/images/JUICY_FOREST_FOOD_GARDEN.png" alt="Birds-eye-view food garden" class="block h-full w-full object-cover" /> 
                <div class="absolute inset-0 z-10 flex flex-wrap content-start p-2">
                    {#each sectionInfo as sectionItem (sectionItem.sectionName)}
                        <div class="w-1/2 h-1/2 p-1">
                            <div class={`w-full h-full rounded-2xl border-2 p-4 flex flex-col justify-between transition-all duration-200 hover:scale-[0.98] cursor-pointer ${sectionItem.issue ? "bg-rose-500/20 border-rose-400 hover:border-rose-500 hover:bg-rose-500/30" : "bg-green-600/20 border-green-500 hover:border-green-400 hover:bg-green-600/30"}`}>
                                <div class="flex items-center justify-between">
                                    <div class="rounded-full bg-white px-3 py-1 shadow-sm">
                                        <p class="text-xs font-bold text-stone-700">{sectionItem.assignedTo}</p>
                                    </div>
                                    {#if sectionItem.issue}
                                        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600 shadow-sm">
                                            <i class="fa-solid fa-exclamation text-xs"></i>
                                        </div>
                                    {:else}
                                        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm">
                                            <i class="fa-solid fa-check text-xs"></i>
                                        </div>
                                    {/if}
                                </div>
                                <p class="text-white font-bold text-lg drop-shadow-md">{sectionItem.sectionName}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</section>