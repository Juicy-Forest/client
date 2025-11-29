<script>
  import TaskCard from "$lib/components/TaskCard.svelte";
  import CheckboxTask from "$lib/components/CheckboxTask.svelte";

  export let tasks = 
    [
      { label: "Water plants", checked: false },
      { label: "Check for pests", checked: false },
      { label: "Remove weeds", checked: false },
    ];

  let color;
  let initials;
  let title;
  let assigned;

  let newTasks = "";

  function addTasks(){
    if(newTasks.trim()){
        tasks = [...tasks, {label: newTasks, checked: false}]
        newTasks = "";
    }
  }

  function toggleChecked(/** @type {number} **/n){
    tasks[n].checked = !tasks[n].checked;
  }

$: completed = tasks.filter((t) => t.checked).length;
</script>

<TaskCard 
    {color}
    {initials}
    {title}
    {assigned}
    {completed}
    total={tasks.length}
/>

<div class="mt-6 mb-6 flex flex-col gap-2">
    {#each tasks as task, i}
        <div class="group flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50/50 px-3 py-2.5 transition-all hover:border-stone-200 hover:bg-white">
            <CheckboxTask
                checked = {task.checked}
                label = {task.label}
                onChange={()=> toggleChecked(i)}
            />
        </div>
    {/each}
</div>

<form class="flex gap-2" on:submit|preventDefault={addTasks}>
    <input 
        class="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-lime-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime-100 transition-all"
        type="text"
        bind:value={newTasks}
        placeholder="Add a new task..."
    />

    <button 
    class="rounded-xl bg-lime-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-lime-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
    type="submit"
    disabled={!newTasks.trim()}
    >Add</button>
</form>
