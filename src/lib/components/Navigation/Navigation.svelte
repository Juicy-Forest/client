<script lang="ts">
  import { goto } from '$app/navigation';
  import NavLink from "./NavLink.svelte";
  let openNavbar = false
  
  const { gardenData } = $props();
  let navigationLinks = [
    {
      route: "/",
      text: "Home",
      icon: "fa solid fa-home"
    },
    {
      route: "/map",
      text: "Map",
      icon: "fa solid fa-map"
    },
    {
      route: "/tasks",
      text: "Tasks",
      icon: "fa solid fa-tasks"
    },
    {
      route: "/chat",
      text: "Chat",
      icon: "fa solid fa-message"
    },
    {
      route: "/inventory",
      text: "Inventory",
      icon: "fa solid fa-box"
    },

  ]

  const dynamicLinks = $derived(navigationLinks.map(link => ({
    ...link,
    route: gardenData._id ? `${link.route}?gardenId=${gardenData._id}` : link.route
  })));

  let notifications: {section: string, description: string}[] = [
    {
      section: "South section - Flowers",
      description: "Low soil moisture (35%) - requires watering"
    },
    {
      section: "South section - Flowers",
      description: "Not watered for 8 hours"
    },
  ]

  let showNotificationTab = false;
</script>

<nav class="w-full h-[80px] flex">
  <!-- Navbar for screen size lg+ -->
  <div class="flex w-full w-[50%]  items-center h-full justify-between items-center px-2 sm:px-4 md:px-10 ">
  <!-- Juicy forest icon -->
   <div class="flex items-center gap-3 w-[240px]">
    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-lime-100 text-lime-700 shadow-sm">
      <i class="fa-solid fa-seedling text-lg"></i>
    </div>
    <div class="hidden flex-col md:hidden lg:flex">
      <p class="text-[10px] font-bold uppercase tracking-widest text-stone-400">Current Garden</p>
      <p class="text-sm font-bold text-stone-700 leading-tight">{gardenData.name}</p>
    </div>
   </div>
  <!-- Center navbar -->
  <div class="flex justify-center hidden md:flex text-center items-center ">
    <ul
      class="flex justify-center gap-6  px-8 items-center text-neutral-300"
    >
    {#each dynamicLinks as navItem (navItem.route)}
      <li><NavLink route={navItem.route} text={navItem.text} icon={navItem.icon} orientation={"Vertical"} onClick={() => {}} /></li> |
    {/each}
    </ul>
  </div>
  <!-- Notifications -->
   <div class="w-[200px] flex hidden md:flex justify-end gap-2 relative z-50">
    <form method="POST" action="/logout">
      <button type="submit" class="flex items-center gap-2 group active:scale-[0.95] duration-200 transform cursor-pointer relative hover:bg-stone-100 duration-300 rounded-full p-3">
        <i class="fa-solid fa-lock group-hover:text-stone-800 text-stone-500 duration-200 text-lg"></i>
      </button>
    </form>
    <button on:click={() => showNotificationTab = !showNotificationTab} class="flex items-center gap-2 group active:scale-[0.95] duration-200 transform cursor-pointer relative hover:bg-stone-100 duration-300 rounded-full p-3">
        {#if notifications.length > 0}
          <div class="bg-rose-500 h-4 w-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center absolute top-1 right-1 ring-2 ring-white">{notifications.length}</div>
        {/if}

      <i class="fa-solid fa-bell group-hover:text-stone-800 text-stone-500 duration-200 text-lg"></i>
    </button>
    <button onclick={() => {goto('/settings')}} class="flex items-center gap-2 group active:scale-[0.95] duration-200 transform cursor-pointer relative hover:bg-stone-100 duration-300 rounded-full p-3">
    <i class="fa-solid fa-gear group-hover:text-stone-800 text-stone-500 duration-200 text-lg"></i>    
    </button>
    {#if showNotificationTab}
      <div class="absolute right-0 mt-14 w-80 origin-top-right rounded-3xl bg-white p-4 shadow-xl ring-1 ring-black/5 focus:outline-none border border-stone-100 z-50">
        <div class="mb-4 flex items-center justify-between px-2">
            <div>
                <p class="text-sm font-bold text-stone-800">Notifications</p>
                <p class={`${notifications.length > 0 ? 'block' : 'hidden'} text-xs text-stone-500`}>{notifications.length} alerts require attention</p>
            </div>
            {#if notifications.length > 0}
                <span class="flex h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"></span>
            {/if}
        </div>
        
        <div class="flex flex-col gap-2">
          {#each notifications as notif (notif.description)}
            <div class="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-stone-50 cursor-pointer">
              <div class="mt-1 flex h-2 w-2 flex-none rounded-full bg-rose-500 shadow-sm group-hover:scale-110 transition-transform"></div>
              <div class="flex flex-col gap-0.5">
                <p class="text-xs font-bold text-stone-700">{notif.section}</p>
                <p class="text-xs leading-relaxed text-stone-500">{notif.description}</p>
              </div>
            </div>
          {/each}
          {#if notifications.length == 0}
          <div class="flex flex-col items-center justify-center py-8 text-center">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-lime-100 text-lime-600">
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
   <!-- Navbar on small screens -->
   <div class={`block md:hidden top-0 left-0 h-full w-[50%] flex justify-end items-center px-8 `}>
      <button aria-label=" " onclick={() => openNavbar = true} >        
        <i class="fa-solid fa-bars text-neutral-600 transform scale-[2.5] cursor-pointer hover:opacity-80 "></i> hi
      </button>
   </div>

   <!-- Absolute full screen navbar for mobile -->
   <div class={` ${openNavbar ? "block" : "hidden"} absolute h-screen w-screen z-[100] bg-white top-1 left-1 rounded-md border-[#e5e5e5] border justify-center`}>
    <button aria-label=" " class="absolute top-5 right-15 cursor-pointer hover:opacity-80 duration-200" onclick={() => openNavbar = false}>
      <i class="fa-solid fa-x transform scale-[2] text-neutral-600"></i>
    </button>
    <ul class="flex flex-col items-center mt-[35%]">
        {#each dynamicLinks as navItem (navItem.route) }
          <li class="text-2xl">
            <NavLink route={navItem.route} text={navItem.text} icon={navItem.icon} orientation={'Horizontal'} onClick={() => openNavbar = false} />
          </li>
        {/each}
    </ul>
    </div>
</nav>
