
<script>
  //@ts-nocheck
  import { invalidateAll } from "$app/navigation";
  import SideBar from "$lib/components/Tasks/SideBar.svelte";
  import TaskHeader from "$lib/components/Tasks/TaskHeader.svelte";
  import TaskSection from "$lib/components/Tasks/TaskSection.svelte";

  let { data } = $props();

  let sections = $derived(data.sectionData?.map(section => ({
    _id: section._id,
    color: section.color,
    initials: section.sectionName.charAt(0).toUpperCase(),
    title: section.sectionName,
    assigned: data.userData?.username || "You"
  })) || []);

  // Group tasks by sectionId
  let tasksBySection = $derived(sections.reduce((acc, section) => {
    acc[section._id] = data.tasks.filter(task => task.sectionId === section._id);
    return acc;
  }, {}));

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
                <TaskSection {section} {data} tasks={tasksBySection[section._id] || []}/>
              {/each} 
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</section>
