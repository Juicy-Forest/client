<script>
  export let currentGarden = "Blooming Meadows";
  export let activePage = "Home";
</script>

<div class=" h-full w-60 p-4 flex flex-col">
  <div class="flex inline-flex">
    <img src="garden-logo.png" alt="Garden Logo" class="h-11 w-11 mb-8" />
    <h1 class="text-2xl font-bold text-green-700 mb-6">Juicy Forest</h1>
  </div>
  <div class="bg-green-100 rounded px-3 py-2 mb-4 text-green-700">
    {currentGarden}
  </div>

  <nav class="flex flex-col gap-2 flex-1">
    <ul class="flex flex-col gap-5 text-gray-600">
      <li>
        <a href="/" class="flex items-center gap-2 hover:font-bold {activePage === 'Home' ? 'font-bold text-green-700' : ''}">
          <img src="home-logo.png" alt="Home" class="h-10 w-10" />
          Home
        </a>
      </li>
      <li>
        <a href="/" class="flex items-center gap-2 hover:font-bold {activePage === 'Map' ? 'font-bold text-green-700' : ''}">
          <img src="map-logo.png" alt="Map" class="h-10 w-10" />
          Map
        </a>
      </li>
      <li>
        <a href="/weeklyTasks" class="flex items-center gap-2 hover:font-bold {activePage === 'Weekly Tasks' ? 'font-bold text-green-700' : ''}">
          <img src="tasks-logo.png" alt="Weekly Tasks" class="h-10 w-10" />
          Weekly Tasks
        </a>
      </li>
      <li>
        <a href="/" class="flex items-center gap-2 hover:font-bold {activePage === 'Stats' ? 'font-bold text-green-700' : ''}">
          <img src="stats-logo.png" alt="Stats" class="h-10 w-10" />
          Stats
        </a>
      </li>
      <li>
        <a href="/" class="flex items-center gap-2 hover:font-bold {activePage === 'Inventory' ? 'font-bold text-green-700' : ''}">
          <img src="inventory-logo.png" alt="Inventory" class="h-10 w-10" />
          Inventory
        </a>
      </li>
      <li>
        <a href="/" class="flex items-center gap-2 hover:font-bold {activePage === 'Chat' ? 'font-bold text-green-700' : ''}">
          <img src="chat-logo.png" alt="Chat" class="h-10 w-10" />
          Chat
        </a>
      </li>
      <li>
        <a href="/" class="flex items-center gap-2 hover:font-bold {activePage === 'Settings' ? 'font-bold text-green-700' : ''}">
          <img src="settings-logo.png" alt="Settings" class="h-10 w-10" />
          Settings
        </a>
      </li>
    </ul>
  </nav>
</div>
