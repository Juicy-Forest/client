<script lang="ts">
  import type { GardenData } from '$lib/types/garden.js';



  let activeTab = $state('profile');
  let { data } = $props();
  let user: any = $state(data.userData);
  let gardenData: GardenData = data.gardenData;
  let gardens = $state(data?.gardenData ?? []);

  const settingsOptions = [
    {
      id: 'profile',
      label: 'Profile',
      icon: 'fa-solid fa-user',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'garden',
      label: 'Garden',
      icon: 'fa-solid fa-leaf',
      color: 'bg-green-100 text-green-700'
    }
  ];
</script> 


<section
  class="box-border min-h-screen overflow-hidden bg-[#fdfcf8] px-4 pb-8 pt-12 text-stone-800 sm:px-8 lg:px-12"
>
  <div
    class="mx-auto grid w-full max-w-none items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]"
  >
    <!-- sidebar -->
    <aside
      class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-3xl border border-stone-200/60 bg-white/60 px-5 py-6 shadow-sm backdrop-blur-xl transition-colors hover:bg-white/80"
    >
      <header class="mb-6 px-2">
        <p class="text-xs font-bold uppercase tracking-widest text-stone-400">
          Settings
        </p>
        <h1 class="mt-1 text-lg font-bold tracking-tight text-stone-800">
          Dashboard
        </h1>
      </header>

      <div class="flex-1 overflow-y-auto pr-1">
        <div class="flex flex-col gap-2">
          {#each settingsOptions as option (option.id)}
            <button
              onclick={() => (activeTab = option.id)}
              class={`p-3 rounded-2xl border transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                activeTab === option.id
                  ? 'border-lime-300 bg-lime-50/80 shadow-sm'
                  : 'border-stone-200 bg-white/50 hover:border-lime-200 hover:bg-lime-50/50'
              }`}
            >
              <div
                class={`flex h-8 w-8 items-center justify-center rounded-full ${option.color}`}
              >
                <i class={option.icon}></i>
              </div>
              <div class="text-left">
                <p class="text-xs font-medium text-stone-400 uppercase tracking-wide">
                  {option.label}
                </p>
              </div>
            </button>
          {/each}
        </div>
      </div>
    </aside>

    <div
      class="flex h-[calc(100vh-10.5rem)] flex-col rounded-[2.5rem] border border-stone-200/60 bg-white/80 shadow-xl shadow-stone-200/20 backdrop-blur-xl"
    >
      <header
        class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-white/50 px-8 py-5 backdrop-blur-sm"
      >
        <div>
          <h2 class="text-lg font-bold text-stone-800">
            {settingsOptions.find((opt) => opt.id === activeTab)?.label || 'Settings'}
          </h2>
          <p class="mt-0.5 text-sm text-stone-500">
            Manage your {settingsOptions.find((opt) => opt.id === activeTab)?.label?.toLowerCase()} preferences
          </p>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto bg-stone-50/30 px-8 py-6">
        <!-- profile Settings -->
        {#if activeTab === 'profile'}
          <div class="space-y-6">
            <div class="rounded-2xl border border-stone-200 bg-white p-6">
              <h3 class="mb-4 text-sm font-bold text-stone-800">Account Information</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-medium text-stone-600 mb-2">Username</label>
                  <input
                    type="text"
                    class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                    placeholder={user.username}
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-stone-600 mb-2">Email</label>
                  <input
                    type="email"
                    class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                    placeholder={user.email}
                  />
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-stone-200 bg-white p-6">
              <h3 class="mb-4 text-sm font-bold text-stone-800">Change Password</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-medium text-stone-600 mb-2">Current Password</label>
                  <input
                    type="password"
                    class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-stone-600 mb-2">New Password</label>
                  <input
                    type="password"
                    class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                </div>
              </div>
            </div>
          </div>
        {/if}

        <!-- garden Settings -->
        {#if activeTab === 'garden'}
          <div class="space-y-6">
            <div class="rounded-2xl border border-stone-200 bg-white p-6">
              <h3 class="mb-4 text-sm font-bold text-stone-800">Garden Preferences</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-medium text-stone-600 mb-2">Garden Name</label>
                  <input
                    type="text"
                    class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                    placeholder={gardens[0].name}
                  />
                </div>
              </div>
            </div>

            
          </div>
        {/if}


      </div>
    </div>
  </div>
</section>