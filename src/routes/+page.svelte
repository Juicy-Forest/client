<script>
    import Construction from "$lib/components/Construction.svelte";

    // Placeholder
    let user = "Jon Snow"
    let sectionInfo = [
        {
            assignedTo: 'Tyrion',
            sectionName: "Section A - Vegetables",
            issue: false
        },
        {
            assignedTo: 'Jon',
            sectionName: "Section B - Herbs",
            issue: true
        },
        {
            assignedTo: 'Marco Polo',
            sectionName: "Section C - Fruits",
            issue: false
        },
        {
            assignedTo: 'Tyrell',
            sectionName: "Section D - Flowers",
            issue: false
        },
    ]

    let generalInformation = [
        {
            statName: "Temperature",
            statValue: "23°C"
        },
        {
            statName: "Humidity",
            statValue: "18%"
        },
        {
            statName: "Last watered",
            statValue: "2 hours ago"
        },
    ]
</script>

<!-- <Construction text={"Juicy Forest"}/> -->
<div class="w-full h-screen">
    <div class="w-full bg-[#f9fafb] border-t border-[#e5e5e5] h-[100%] p-4 sm:p-10 md:p-12 flex flex-col md:flex-row gap-6 md:justify-center ">
        <!-- Left container (top) -->
        <div class="w-[100%] md:w-[65%] h-[full] flex flex-col gap-2 max-w-[700px]">
            <!-- Secondary header -->
            <div class="w-full flex items-center justify-between mb-4">
                <h2 class="text-3xl">Greetings, {user}</h2>
                <button class="rounded-md flex items-center gap-2 p-2 border-[#e5e5e5] border bg-white cursor-pointer text-md "> <i class={'fa-solid fa-gear text-neutral-600 '}></i> Garden Settings</button>
            </div>
            <div class="w-full h-fit relative  ">
                <img src="/images/JUICY_FOREST_FOOD_GARDEN.png" alt="Birds-eye-view food garden" height="100" width="100" class="aspect-square w-full rounded-md"> 
                <div class="absolute top-0 left-0 z-[50] w-full p-1 h-full flex flex-wrap gap-y-0 gap-x-1 leading-none items-center justify-center">
                    {#each sectionInfo as sectionItem (sectionItem.sectionName)}
                        <div class={`w-[49%] h-[49%] rounded-md border-2 relative p-2 flex flex-col justify-between ${sectionItem.issue ? "bg-rose-400/15 border-rose-400 hover:border-rose-500 hover:bg-rose-400/25" : "bg-green-600/15 border-green-600 hover:border-green-500 hover:bg-green-600/25"} transform hover:scale-[0.99] duration-100 cursor-pointer ` }>
                            <div class="w-full flex items-center justify-between ">
                                <div class="rounded-full w-fit px-2 py-1 bg-white">
                                    <p class="text-sm">{sectionItem.assignedTo}</p>
                                </div>
                                <div class={`h-[15px] w-[15px] rounded-full ${sectionItem.issue ? "bg-rose-400" : "bg-green-600"}`}></div>
                            </div>
                            <p class="text-white">{sectionItem.sectionName}</p>
                        </div>
                    {/each}
                </div>
            </div>
            <div class="flex items-center gap-2">
                <div class="rounded-sm h-[15px] w-[15px] bg-green-600"></div>
                <p>Good</p>
                <div class="rounded-sm h-[15px] w-[15px] bg-rose-400"></div>
                <p>Issue</p>
            </div>
        </div>
        
        <!-- Right container (bottom) -->
        <div class="w-[100%] md:w-[35%] rounded-md border-[#e5e5e5] border h-fit bg-white md:max-w-[350px]">
            <div class="border-[#e5e5e5] p-4 flex flex-col gap-2">
                <p>General Information</p>
                {#each generalInformation as stats (stats.statName)}
                    <div class="p-3 rounded-md border border-[#e5e5e5]/70 bg-[#F9FAFB] flex items-center gap-2">
                        <i class="fa-leaf fa-solid text-green-600"></i>
                        <p class="text-sm text-neutral-600">    
                            {stats.statName}: {stats.statValue}
                        </p>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>