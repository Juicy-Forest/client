<script lang="ts">
  import NavLink from "./NavLink.svelte";
  let gardenName = "Harvest Moon Plot"

  let openNavbar = false

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
   <div class="flex items-center gap-2 w-[200px]">
    <div class="flex items-center justify-center rounded-full bg-green-600 p-3">
      <i class="fa-solid fa-seedling text-white"></i>
    </div>
    <div class="border-green-600/30 border bg-green-600/20 md:hidden lg:block  rounded-md w-fit h-full px-2 flex flex-col py-1">
      <p class="text-neutral-600 text-xs">Current Garden</p>
      <p class="text-base text-green-800 -mt-1">Harvet Moon Plot</p>
    </div>
   </div>
  <!-- Center navbar -->
  <div class="flex justify-center hidden md:flex text-center items-center ">
    <ul
      class="flex justify-center gap-6  px-8 items-center text-neutral-300"
    >
    {#each navigationLinks as navItem (navItem.route)}
      <NavLink route={navItem.route} text={navItem.text} icon={navItem.icon} orientation={"Vertical"} onClick={() => {}} /> | 
    {/each}
    </ul>
  </div>
  <!-- Notifications -->
   <div class="w-[200px] flex hidden md:flex justify-end relative">
    <button on:click={() => showNotificationTab = !showNotificationTab} class="flex items-center gap-2 group p-2 active:scale-[0.95] duration-200 transform cursor-pointer relative hover:bg-[#e5e5e5] duration-300 rounded-full p-2">
        {#if notifications.length > 0}
          <div class="bg-rose-500 h-[20px] rounded-full w-[20px] text-white flex items-center justify-center absolute -top-[5px] -right-[5px]">{notifications.length}</div>
        {/if}

      <i class="fa-solid fa-bell group-hover:text-yellow-500 text-neutral-600 duration-200"></i>
    </button>
    {#if showNotificationTab}
      <div class="absolute rounded-md shadow-sm border-[#e5e5e5] border w-[350px] h-fit bg-white top-[150%] ">
        <div class="w-full p-4 border-b border-[#e5e5e5]">
          <p class="font-semibold text-neutral-600 text-sm">
            Notifications
          </p>
          <p class={`${notifications.length > 0 ? 'block' : 'hidden'} text-xs text-neutral-500 pt-1`}>{notifications.length} alerts require attention.</p>
        </div>
        <div class="flex items-start flex-col">
          {#each notifications as notif (notif.description)}
            <div class="w-full flex h-fit p-5 items items-center gap-1 border-b border-[#e5e5e5] hover:cursor-pointer hover:bg-[#e5e5e5]/40 duration-200">
              <div class="w-[10px] h-[10px] bg-rose-500 mr-4 rounded-full"></div>
              <div class="flex flex-col items-start gap-1">
                <p class="text-sm">{notif.section}</p>
                <p class="text-xs">{notif.description}</p>
              </div>
            </div>
          {/each}
          {#if notifications.length == 0}
          <div class="mx-auto flex flex-col gap-2 py-7">
            <div class="rounded-full bg-green-200 flex items-center justify-center mx-auto h-[40px] w-[40px]">
            <i class="fa-solid fa-seedling text-green-600"></i>
            </div>
            <p class="text-base text-neutral-700 text-center mt-1">All systems healthy!</p>
            <p class="text-xs text-neutral-500 text-center">No alerts at this time.</p>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
   </div>
   <!-- Navbar on small screens -->
   <div class={`block md:hidden top-0 left-0 h-full w-[50%] flex justify-end items-center px-8 `}>
      <button aria-label=" " on:click={() => openNavbar = true} >        
        <i class="fa-solid fa-bars text-neutral-600 transform scale-[2.5] cursor-pointer hover:opacity-80 "></i> hi
      </button>
   </div>

   <!-- Absolute full screen navbar for mobile -->
   <div class={` ${openNavbar ? "block" : "hidden"} absolute h-screen w-screen z-[100] bg-white top-1 left-1 rounded-md border-[#e5e5e5] border justify-center`}>
    <button aria-label=" " class="absolute top-5 right-15 cursor-pointer hover:opacity-80 duration-200" on:click={() => openNavbar = false}>
      <i class="fa-solid fa-x transform scale-[2] text-neutral-600"></i>
    </button>
    <ul class="flex flex-col items-center mt-[35%]">
        {#each navigationLinks as navItem (navItem.route) }
          <li class="text-2xl">
            <NavLink route={navItem.route} text={navItem.text} icon={navItem.icon} orientation={'Horizontal'} onClick={() => openNavbar = false} />
          </li>
        {/each}
    </ul>
    </div>
</nav>

