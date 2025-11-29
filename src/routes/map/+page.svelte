<script lang="ts">
    import Map from '$lib/components/Map/Map.svelte';

    let selectedIcon: string | null = null;
    let isEditMode = false;

    function select(icon: string) {
        selectedIcon = selectedIcon === icon ? null : icon;
    }

    function toggleEditMode() {
        isEditMode = !isEditMode;
        selectedIcon = null; 
    }

    function handlePlaced(e: CustomEvent) {
        console.log('placed', e.detail);
    }
</script>

<svelte:head>
    <link rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" 
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLMDJ8XyY04HwBq2M8oE4hUeL9A5z/Q1qB8JvB6o2M9bA6p2d/A8uA==" 
          crossorigin="anonymous" 
          referrerpolicy="no-referrer" />
</svelte:head>

<section class="box-border min-h-screen bg-[#fdfcf8] px-4 pb-8 pt-12 text-stone-800 sm:px-8 lg:px-12">
  <div class="mx-auto grid w-full max-w-none items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
    
    <!-- Sidebar -->
    <aside class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-3xl border border-stone-200/60 bg-white/60 px-5 py-6 shadow-sm backdrop-blur-xl transition-colors hover:bg-white/80">
      <header class="mb-6 px-2">
        <p class="text-xs font-bold uppercase tracking-widest text-stone-400">Navigation</p>
        <h1 class="mt-1 text-lg font-bold tracking-tight text-stone-800">Garden Map</h1>
      </header>

      <div class="flex-1 overflow-y-auto pr-1">
        <div class="flex flex-col gap-4">
            <div class="rounded-2xl border border-stone-200 bg-stone-50/50 p-4">
                <div class="flex items-center gap-3 mb-2">
                    <span class="text-xl">📍</span>
                    <div>
                        <p class="text-sm font-bold text-stone-700">Amsterdam Garden</p>
                        <p class="text-xs text-stone-500">Netherlands</p>
                    </div>
                </div>
            </div>

            <div class="my-2 border-t border-stone-100"></div>

            <div class="px-2">
                <p class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Controls</p>
                <button
                    on:click={toggleEditMode}
                    class={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${isEditMode ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-200' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                >
                    <i class="fa-solid fa-pen"></i>
                    <span>{isEditMode ? 'Finish Editing' : 'Edit Layout'}</span>
                </button>
            </div>

            {#if isEditMode}
                <div class="px-2 pt-2">
                    <p class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Tools</p>
                    <div class="grid grid-cols-2 gap-2">
                        <button type="button" 
                            class={`flex flex-col items-center justify-center gap-1 rounded-xl border p-3 transition-all ${selectedIcon === 'water' ? 'border-blue-400 bg-blue-50 text-blue-700 shadow-sm' : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50'}`}
                            on:click={() => select('water')} 
                            aria-label="Water">
                            <span class="text-2xl">💧</span>
                            <span class="text-[10px] font-bold uppercase tracking-wide">Water</span>
                        </button>
                        <button type="button" 
                            class={`flex flex-col items-center justify-center gap-1 rounded-xl border p-3 transition-all ${selectedIcon === 'plant' ? 'border-green-400 bg-green-50 text-green-700 shadow-sm' : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50'}`}
                            on:click={() => select('plant')} 
                            aria-label="Plant">
                            <span class="text-2xl">🌱</span>
                            <span class="text-[10px] font-bold uppercase tracking-wide">Plant</span>
                        </button>
                        <button type="button" 
                            class={`flex flex-col items-center justify-center gap-1 rounded-xl border p-3 transition-all ${selectedIcon === 'plants' ? 'border-green-400 bg-green-50 text-green-700 shadow-sm' : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50'}`}
                            on:click={() => select('plants')} 
                            aria-label="Plants Group">
                            <span class="text-2xl">🌿</span>
                            <span class="text-[10px] font-bold uppercase tracking-wide">Patch</span>
                        </button>
                        <button type="button" 
                            class={`flex flex-col items-center justify-center gap-1 rounded-xl border p-3 transition-all ${selectedIcon === 'bush' ? 'border-lime-400 bg-lime-50 text-lime-700 shadow-sm' : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50'}`}
                            on:click={() => select('bush')} 
                            aria-label="Bush">
                            <span class="text-2xl">🌾</span>
                            <span class="text-[10px] font-bold uppercase tracking-wide">Bush</span>
                        </button>
                        <button type="button" 
                            class={`flex flex-col items-center justify-center gap-1 rounded-xl border p-3 transition-all ${selectedIcon === 'tree' ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50'}`}
                            on:click={() => select('tree')} 
                            aria-label="Tree">
                            <span class="text-2xl">🌳</span>
                            <span class="text-[10px] font-bold uppercase tracking-wide">Tree</span>
                        </button>
                    </div>
                </div>
            {/if}
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-white/80 shadow-xl shadow-stone-200/20 backdrop-blur-xl">
      
      <!-- Header -->
      <header class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-white/50 px-8 py-5 backdrop-blur-sm">
        <div>
          <h2 class="text-lg font-bold text-stone-800">Interactive Layout</h2>
          <p class="mt-0.5 text-sm text-stone-500">
             {isEditMode ? 'Select an item from the sidebar and click on the map to place it.' : 'Visualize and manage plants in your garden.'}
          </p>
        </div>
        {#if isEditMode}
            <span class="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                <div class="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
                Editing Active
            </span>
        {/if}
      </header>

      <!-- Content -->
      <div class="flex flex-1 flex-col overflow-hidden bg-stone-50/30 relative">
        <div class="absolute inset-0 p-4">
            <div class="h-full w-full overflow-hidden rounded-2xl shadow-sm border border-stone-200 bg-white">
                <Map {selectedIcon} {isEditMode} on:placed={handlePlaced} />
            </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
    :global(body) {
        background-color: #fdfcf8;
    }
</style>


