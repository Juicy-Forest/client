<script>
  import TaskCard from "$lib/components/TaskCard.svelte";
  import CheckboxTask from "$lib/components/CheckboxTask.svelte";

  // Exposed props with sensible defaults
  export let color = "bg-blue-500";
  export let initials = "S";
  export let title = "North Section - Vegetables";
  export let assigned = "Sam";
  export let tasks = [
    { label: "Water plants", checked: false },
    { label: "Check for pests", checked: false },
    { label: "Remove weeds", checked: false },
  ];

  let newTask = "";

  // Toggle the checked state of a task by index
  function toggleChecked(/** @type {number} */ n) {
    tasks[n].checked = !tasks[n].checked;
  }

  function addTask() {
    if (newTask.trim()) {
      tasks = [...tasks, { label: newTask, checked: false }];
      newTask = "";
    }
  }

  $: completed = tasks.filter((t) => t.checked).length;
</script>

<TaskCard
  {color}
  {initials}
  sectionName={title}
  {assigned}
  {completed}
  total={tasks.length}
/>

<div class="flex flex-col space-y-4 mt-2 mb-6">
  {#each tasks as task, i (task.label)}
    <CheckboxTask
      checked={task.checked}
      label={task.label}
      onChange={() => toggleChecked(i)}
    />
  {/each}
</div>

<hr class="my-3" />

<div class="flex">
  <input
    class="flex-1 border rounded-full p-2 bg-gray-100"
    type="text"
    bind:value={newTask}
    placeholder="Add a new task..."
    on:keydown={(e) => e.key === "Enter" && addTask()}
  />
  <button
    class="ml-2 px-4 py-2 bg-green-500 text-white rounded-full"
    on:click={addTask}>+ Add</button
  >
</div>
