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

<main class="m-6">
    <div class="w-full flex pt-30">
        <div class="flex-1">
            <div class="flex flex-col">
                <div class="flex flex-row items-center">
                    <h1 class="text-4xl font-bold mb-2 pr-5">Weekly Tasks</h1>
                    <span class="font-semibold text-green-700">Juicy Forest</span>
                    <span class="text-gray-500"> / {currentGarden} </span>
                </div>
                <h2 class="text-gray-500 mb-6">Manage weekly garden tasks for each section</h2>
            </div>
        </div>

        <div class="flex gap-2 items-center">
            <button class="rounded-full bg-white border border-gray-300 px-4 py-2 text-gray-600"
                    disabled>
            Resets in 7 days.
            </button>

            <button class="rounded-full bg-white border border-gray-300 px-4 py-2 text-gray-600 hover:font-bold">
                Reset All Tasks
            </button>
        </div>
    </div>

    <div class="flex gap-8 mt-8 h-full bg-gray-200 rounded-lg">
        <div class="flex-1 h-full">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 p-6 rounded-lg h-full m-2">
                {#each sections as section}
                    <div class="bg-white p-5 rounded-lg">
                        <TaskSection {...section} />
                    </div>
                {/each}
            </div>
        </div>
    </div>
</main>
