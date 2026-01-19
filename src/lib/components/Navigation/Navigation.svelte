<script lang="ts">
  import { goto } from '$app/navigation';
  import NavLink from './NavLink.svelte';
  let openNavbar = $state(false);

  const { gardenData } = $props();
  const navigationLinks = [
      {
          route: '/',
          text: 'Home',
          icon: 'fa solid fa-home',
      },
      {
          route: '/map',
          text: 'Map',
          icon: 'fa solid fa-map',
      },
      {
          route: '/tasks',
          text: 'Tasks',
          icon: 'fa solid fa-tasks',
      },
      {
          route: '/chat',
          text: 'Chat',
          icon: 'fa solid fa-message',
      },
      {
          route: '/inventory',
          text: 'Inventory',
          icon: 'fa solid fa-box',
      },
  ];

  const dynamicLinks = $derived(
      navigationLinks.map((link) => ({
          ...link,
          route: gardenData._id
              ? `${link.route}?gardenId=${gardenData._id}`
              : link.route,
      })),
  );

  const notifications: { section: string; description: string }[] = [
      {
          section: 'South section - Flowers',
          description: 'Low soil moisture (35%) - requires watering',
      },
      {
          section: 'South section - Flowers',
          description: 'Not watered for 8 hours',
      },
  ];

  let showNotificationTab = $state(false);
</script>

<nav class="fixed top-0 left-0 right-0 z-40 px-4 pt-4">
  <!-- Navbar for screen size lg+ -->
  <div class="mx-auto flex max-w-screen-2xl items-center justify-between gap-4">
    <!-- Logo Pill -->
    <div class="hidden md:flex items-center gap-3 rounded-full border border-stone-200/60 bg-white/80 px-4 py-2 shadow-lg shadow-stone-200/20 backdrop-blur-xl">
      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-lime-600 text-white">
        <i class="fa-solid fa-seedling"></i>
      </div>
      <div class="hidden flex-col lg:flex">
        <p class="text-[9px] font-bold uppercase tracking-widest text-stone-400">
          Current Garden
        </p>
        <p class="text-sm font-bold text-stone-800 leading-tight">
          {gardenData.name || 'Garden'}
        </p>
      </div>
    </div>

    <!-- Center Navigation Pill -->
    <div class="hidden md:flex">
      <ul class="flex items-center gap-1 rounded-full border border-stone-200/60 bg-white/80 px-2 py-2 shadow-lg shadow-stone-200/20 backdrop-blur-xl">
        {#each dynamicLinks as navItem (navItem.route)}
          <li>
            <NavLink
              route={navItem.route}
              text={navItem.text}
              icon={navItem.icon}
              orientation="Vertical"
              onClick={() => {}}
            />
          </li>
        {/each}
      </ul>
    </div>

    <!-- Action Buttons -->
    <div class="hidden md:flex items-center gap-2 relative z-50">
      <div class="flex items-center gap-1 rounded-full border border-stone-200/60 bg-white/80 px-1 py-1 shadow-lg shadow-stone-200/20 backdrop-blur-xl">
        <button
          onclick={() => (showNotificationTab = !showNotificationTab)}
          class="relative flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition-all hover:bg-stone-100 hover:text-stone-800 active:scale-95"
          aria-label="Notifications"
        >
          {#if notifications.length > 0}
            <div class="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
              {notifications.length}
            </div>
          {/if}
          <i class="fa-solid fa-bell text-sm"></i>
        </button>
        
        <button
          onclick={() => goto('/settings')}
          class="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition-all hover:bg-stone-100 hover:text-stone-800 active:scale-95"
          aria-label="Settings"
        >
          <i class="fa-solid fa-gear text-sm"></i>
        </button>

        <form method="POST" action="/logout" class="contents">
          <button
            type="submit"
            class="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition-all hover:bg-stone-100 hover:text-stone-800 active:scale-95"
            aria-label="Logout"
          >
            <i class="fa-solid fa-right-from-bracket text-sm"></i>
          </button>
        </form>
      </div>

      {#if showNotificationTab}
        <div class="absolute right-0 top-14 w-80 origin-top-right rounded-2xl border border-stone-200/60 bg-white/95 p-4 shadow-xl backdrop-blur-xl z-50">
          <div class="mb-4 flex items-center justify-between px-2">
            <div>
              <p class="text-sm font-bold text-stone-800">Notifications</p>
              <p
                class={`${notifications.length > 0 ? 'block' : 'hidden'} text-xs text-stone-500`}
              >
                {notifications.length} alerts require attention
              </p>
            </div>
            {#if notifications.length > 0}
              <span
                class="flex h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
              ></span>
            {/if}
          </div>

          <div class="flex flex-col gap-2">
            {#each notifications as notif (notif.description)}
              <div
                class="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-stone-50 cursor-pointer"
              >
                <div
                  class="mt-1 flex h-2 w-2 flex-none rounded-full bg-rose-500 shadow-sm group-hover:scale-110 transition-transform"
                ></div>
                <div class="flex flex-col gap-0.5">
                  <p class="text-xs font-bold text-stone-700">
                    {notif.section}
                  </p>
                  <p class="text-xs leading-relaxed text-stone-500">
                    {notif.description}
                  </p>
                </div>
              </div>
            {/each}
            {#if notifications.length === 0}
              <div
                class="flex flex-col items-center justify-center py-8 text-center"
              >
                <div
                  class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-lime-100 text-lime-600"
                >
                  <i class="fa-solid fa-check text-lg"></i>
                </div>
                <p class="text-sm font-bold text-stone-700">All Clear!</p>
                <p class="text-xs text-stone-500">No new notifications.</p>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Mobile Navigation -->
  <div class="md:hidden flex items-center justify-between gap-3">
    <!-- Mobile Logo -->
    <div class="flex items-center gap-2 rounded-full border border-stone-200/60 bg-white/80 px-3 py-2 shadow-lg shadow-stone-200/20 backdrop-blur-xl">
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-lime-600 text-white">
        <i class="fa-solid fa-seedling text-sm"></i>
      </div>
      <span class="text-sm font-bold text-stone-800">{gardenData.name || 'Garden'}</span>
    </div>

    <!-- Mobile Menu Button -->
    <button
      onclick={() => (openNavbar = true)}
      class="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200/60 bg-white/80 text-stone-600 shadow-lg shadow-stone-200/20 backdrop-blur-xl transition-all active:scale-95"
      aria-label="Menu"
    >
      <i class="fa-solid fa-bars"></i>
    </button>
  </div>

  <!-- Mobile Full Screen Menu -->
  {#if openNavbar}
    <div class="fixed inset-0 z-50 md:hidden">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/20 backdrop-blur-sm" onclick={() => (openNavbar = false)}></div>
      
      <!-- Menu Panel -->
      <div class="absolute right-4 top-4 bottom-4 w-[280px] rounded-3xl border border-stone-200/60 bg-white/95 shadow-2xl backdrop-blur-xl">
        <div class="flex h-full flex-col p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-2">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-lime-600 text-white">
                <i class="fa-solid fa-seedling"></i>
              </div>
              <div>
                <p class="text-xs font-bold uppercase tracking-widest text-stone-400">Menu</p>
                <p class="text-sm font-bold text-stone-800">{gardenData.name || 'Garden'}</p>
              </div>
            </div>
            <button
              onclick={() => (openNavbar = false)}
              class="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition-all hover:bg-stone-100 hover:text-stone-600"
              aria-label="Close"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Navigation Links -->
          <ul class="flex-1 space-y-2">
            {#each dynamicLinks as navItem (navItem.route)}
              <li>
                <button
                  onclick={() => {
                      goto(navItem.route);
                      openNavbar = false;
                  }}
                  class="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all hover:bg-stone-100"
                >
                  <i class="{navItem.icon} text-stone-500"></i>
                  <span class="font-medium text-stone-700">{navItem.text}</span>
                </button>
              </li>
            {/each}
          </ul>

          <!-- Bottom Actions -->
          <div class="space-y-2 border-t border-stone-200 pt-4">
            <button
              onclick={() => {
                  goto('/settings');
                  openNavbar = false;
              }}
              class="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all hover:bg-stone-100"
            >
              <i class="fa-solid fa-gear text-stone-500"></i>
              <span class="font-medium text-stone-700">Settings</span>
            </button>
            <form method="POST" action="/logout" class="contents">
              <button
                type="submit"
                class="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all hover:bg-red-50"
              >
                <i class="fa-solid fa-right-from-bracket text-stone-500"></i>
                <span class="font-medium text-stone-700">Logout</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  {/if}
</nav>
