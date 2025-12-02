<script lang="ts">
  import NavLink from "./NavLink.svelte";
</script>

<nav class="mt-6 absolute left-1/2 -translate-x-1/2">
  <div class="flex justify-center text-center items-center">
    <ul
      class="flex justify-center gap-8 shadow-md border border-gray-300 rounded-full px-8"
    >
      <NavLink route="/" text="Home" icon="fa-solid fa-home" />
      <NavLink route="/map" text="Map" icon="fa-solid fa-map" />
      <NavLink route="/tasks" text="Tasks" icon="fa-solid fa-tasks" />
      <NavLink route="/chat" text="Chat" icon="fa-solid fa-message" />
      <NavLink route="/inventory" text="Inventory" icon="fa-solid fa-box" />
      <NavLink route="/login" text="login" icon="fa-solid fa-box" />
      <NavLink route="/createjoin" text="createjoin" icon="fa-solid fa-box" />
    </ul>
  </div>
</nav>
