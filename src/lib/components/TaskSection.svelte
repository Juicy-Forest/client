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

<div class="flex flex-col space-y-4 mt-2 mb-6">
    {#each tasks as task, i}
        <CheckboxTask
            checked = {task.checked}
            label = {task.label}
            onChange={()=> toggleChecked(i)}
        />
    {/each}
</div>

<div class="flex">
    <input 
        class="flex-1 border rounded-full p-2 bg-gray-100"
        type="text"
        bind:value={newTasks}
        placeholder="Add a new task..."
    />

    <button 
    class="ml-2 px-4 py-2 bg-green-500 text-white rounded-ful"
    on:click={addTasks}
    >Add</button>
</div>
