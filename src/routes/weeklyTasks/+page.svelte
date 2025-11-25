<script>
  import NavBar from "$lib/components/NavBar.svelte";
  import TaskSection from "$lib/components/TaskSection.svelte";

  let sections = [
    {
      color: "bg-blue-500",
      initials: "S",
      title: "North Section - Vegetables",
      assigned: "Sam",
      tasks: [
        { label: "Water plants", checked: false },
        { label: "Check for pests", checked: false },
        { label: "Remove weeds", checked: false }
      ],
    },
    {
      color: "bg-purple-500",
      initials: "A",
      title: "East Section - Herbs",
      assigned: "Alex",
      tasks: [
        { label: "Water plants", checked: false },
        { label: "Check for pests", checked: false },
        { label: "Remove weeds", checked: false }
      ],
    },
    {
      color: "bg-green-500",
      initials: "J",
      title: "South Section - Flowers",
      assigned: "Jordan",
      tasks: [
        { label: "Water plants", checked: false },
        { label: "Check for pests", checked: false },
        { label: "Remove weeds", checked: false }
      ],
    },
    {
      color: "bg-orange-500",
      initials: "T",
      title: "West Section - Fruits",
      assigned: "Taylor",
      tasks: [
        { label: "Water plants", checked: false },
        { label: "Check for pests", checked: false },
        { label: "Remove weeds", checked: false }
      ],
    },
  ];
</script>

<div class="flex bg-gray-50">
  <!-- Navigation Bar -->
  <NavBar activePage="Weekly Tasks" currentGarden="Blooming Meadows" />
  
  <!-- Main content -->
  <main class="flex-1 h-full px-16 py-10 bg-gray-100">
    <div class="flex items-center gap-2 mb-4">
      <button class="fixed top-4 right-4 p-2 rounded-full bg-white shadow-lg hover:bg-green-100">
        <img src="bell-logo.png" alt="notifications" class="w-8 h-8" />
      </button>
      <span class="font-semibold text-green-700">Juicy Forest</span>
      <span class="text-gray-500">/ Blooming Meadows</span>
    </div>
    <div class="flex gap-3 mt-8">
      <div class="flex-col">
        <div class="text-2xl font-bold mb-2">Weekly Tasks</div>
        <div class="text-gray-500 mb-6">
          Manage weekly garden tasks for each section
        </div>
      </div>
      <div class="flex gap-2 ml-auto">
        <button class="rounded-full bg-white border-gray-300 px-4 py-2 text-gray-600 font-normal hover:bg-green-100 hover:font-bold transition">
          Resets in 7 days
        </button>
        <button class="rounded-full bg-white border-gray-300 px-4 py-2 text-gray-600 font-normal hover:bg-green-100 hover:font-bold transition">
          Reset All Tasks
        </button>
      </div>
    </div>

    <div class="flex gap-8 mt-8 h-full">

      <!-- Grid content -->
      <div class="flex-1 h-full">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 p-6 rounded-lg h-full">
          {#each sections as section (section.title)}
            <div class="rounded-lg bg-white p-4 shadow ">
              <TaskSection {...section} />
            </div>
          {/each}
        </div>
      </div>
    </div>
  </main>
</div>
