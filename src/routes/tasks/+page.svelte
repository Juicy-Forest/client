<script>
    import TaskSection from "$lib/components/TaskSection.svelte";

    let tasks;
    let currentGarden = "Garden 1";
    let sections = [
        {
        color: "bg-blue-500",
        initials: "S",
        title: "North Section - Vegetables",
        assigned: "Sam",
        tasks: tasks,
        },

        {
        color: "bg-purple-500",
        initials: "A",
        title: "East Section - Herbs",
        assigned: "Alex",
        tasks: tasks,
        },

        {
        color: "bg-green-500",
        initials: "J",
        title: "South Section - Flowers",
        assigned: "Jordan",
        tasks: tasks,
        },

        {
        color: "bg-orange-500",
        initials: "T",
        title: "West Section - Fruits",
        assigned: "Taylor",
        tasks: tasks,
        },
    ];

</script>

<section class="box-border min-h-screen bg-[#fdfcf8] px-4 pb-8 pt-12 text-stone-800 sm:px-8 lg:px-12">
  <div class="mx-auto grid w-full max-w-none items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
    
    <!-- Sidebar -->
    <aside class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-3xl border border-stone-200/60 bg-white/60 px-5 py-6 shadow-sm backdrop-blur-xl transition-colors hover:bg-white/80">
      <header class="mb-6 px-2">
        <p class="text-xs font-bold uppercase tracking-widest text-stone-400">Planning</p>
        <h1 class="mt-1 text-lg font-bold tracking-tight text-stone-800">Weekly Tasks</h1>
      </header>

      <div class="flex-1 overflow-y-auto pr-1">
        <div class="flex flex-col gap-6">
            <div class="px-2">
                <p class="text-sm text-stone-500 leading-relaxed">
                    Manage weekly garden tasks for each section. Tasks are assigned to team members and tracked here.
                </p>
            </div>

            <div class="border-t border-stone-100"></div>

            <div class="px-2 flex flex-col gap-3">
                 <p class="text-xs font-bold uppercase tracking-widest text-stone-400">Actions</p>
                 
                 <div class="rounded-2xl border border-stone-200 bg-stone-50/50 p-4 text-center">
                    <p class="text-xs font-bold text-stone-400 uppercase">Next Reset</p>
                    <p class="text-lg font-bold text-stone-700 mt-1">7 days</p>
                 </div>

                 <button class="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-stone-600 shadow-sm transition-all hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200">
                    Reset All Tasks
                </button>
            </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-white/80 shadow-xl shadow-stone-200/20 backdrop-blur-xl">
      
      <!-- Header -->
      <header class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-white/50 px-8 py-5 backdrop-blur-sm">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-bold text-stone-800">Task Board</h2>
            <span class="text-stone-400">/</span>
            <span class="text-sm font-medium text-stone-500">{currentGarden}</span>
          </div>
          <p class="mt-0.5 text-sm text-stone-500">Overview of all active tasks by section.</p>
        </div>
        <div class="flex -space-x-2">
            {#each sections as section}
                <div class={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-white text-xs font-bold shadow-sm ${section.color}`}>
                    {section.initials}
                </div>
            {/each}
        </div>
      </header>

      <!-- Content -->
      <div class="flex flex-1 flex-col overflow-hidden bg-stone-50/30">
        <div class="flex-1 overflow-y-auto px-8 py-6">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each sections as section}
                    <div class="rounded-3xl border border-stone-200 bg-white p-2 shadow-sm transition-all hover:shadow-md">
                        <TaskSection {...section} />
                    </div>
                {/each}
            </div>
        </div>
      </div>
    </div>
  </div>
</section>
