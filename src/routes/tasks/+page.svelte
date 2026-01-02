
<script>
  //@ts-nocheck
  import { invalidateAll } from "$app/navigation";
  import SideBar from "$lib/components/Tasks/SideBar.svelte";
  import TaskHeader from "$lib/components/Tasks/TaskHeader.svelte";
  import TaskSection from "$lib/components/Tasks/TaskSection.svelte";

  let sections = [
    { _id: 's1', color: "bg-blue-500", initials: "T", title: "Section - Vegetables", assigned: "Tyrion"},
    { _id: 's2', color: "bg-purple-500", initials: "J", title: "Section - Herbs", assigned: "Jon"},
    { _id: 's3', color: "bg-green-500", initials: "MP", title: "Section - Flowers", assigned: "Marco Polo"},
    { _id: 's4', color: "bg-orange-500", initials: "T", title: "Section - Fruits", assigned: "Tyrell"},
  ];

  let { data } = $props();

</script>

<section class="box-border min-h-screen bg-[#fdfcf8] px-4 pb-8 pt-12 text-stone-800 sm:px-8 lg:px-12">
  <div class="mx-auto grid w-full max-w-none items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
    <SideBar />
    <main class="h-[calc(100vh-10.5rem)]">
      <div class="flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-white/80 shadow-xl shadow-stone-200/20 backdrop-blur-xl">
        <TaskHeader />
        <div class="flex flex-1 flex-col overflow-hidden bg-stone-50/30">
          <div class="flex-1 overflow-y-auto px-8 py-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              {#each sections as section}
                <TaskSection {section} {data} />
              {/each} 
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</section>
