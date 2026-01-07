<script>
    //@ts-nocheck
  import Task from "./Task.svelte";
  import TaskModel from "./TaskModel.svelte";
  import { invalidateAll } from "$app/navigation";
  import Modal from "../util/Modal.svelte";

  let {section, data, tasks} = $props();

  let modalMode = $state("create");
  let selectedTask = $state(null);
  let isModalOpen = $state(false);

  let formDataTask = $state({
    name: "",
    description: "",
    isComplete: false,
  });

  function openEditModal(task) {
    selectedTask = task;
    formDataTask = {
      name: task.name,
      description: task.description,
      isComplete: task.isComplete,
    };
    modalMode = "edit";
    isModalOpen = true;
  }

  function openDeleteModal(task) {
    selectedTask = task;
    modalMode = "delete";
    isModalOpen = true;
  }

  function resetForm() {
    formDataTask = {
      name: "",
      description: "",
      isComplete: false,
      sectionId: section._id,

    };
    selectedTask = null;
  }

  function openCreateModal() {
    resetForm();
    modalMode = "create";
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;

  }
    async function handleSubmit() {
    const baseUrl = "http://localhost:3030/tasks/";
    try {
      let response;
      if (modalMode === "create") {
        response = await fetch(baseUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataTask),
        });
      } else if (modalMode === "edit") {
        response = await fetch(`${baseUrl}${selectedTask?._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataTask),
        });
      } else if (modalMode === "delete") {
        response = await fetch(`${baseUrl}${selectedTask?._id}`, {
          method: "DELETE",
        });
      }

      if (response.ok) {
        closeModal();
        await invalidateAll(); // refreshes page data
      } else {
        closeModal();
      }
    } catch (error) {
      console.error("Network Error", error);
    }
  }

  async function toggleCheck(task) {
    const baseUrl = "http://localhost:3030/tasks/";
    try {
      let response;
      response = await fetch(`${baseUrl}${task._id}/toggle`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        await invalidateAll();
      }
    } catch (error) {
      console.error(error);
    }
  }

</script>

<div class="rounded-2xl border border-stone-200/60 bg-white/60 p-5 backdrop-blur-sm">
    <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <div 
                class="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-sm"
                style="background-color: {section.color || '#84cc16'}"
            >
                {section.initials}
            </div>
            <div>
                <h2 class="text-base font-semibold text-stone-800">{section.title}</h2>
                <p class="text-xs text-stone-500">Assigned to {section.assigned}</p>
            </div>
        </div>
        <button onclick={openCreateModal}
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-600 text-white transition-colors hover:bg-lime-700"
            aria-label="Add task"
        >
            <i class="fa-solid fa-plus text-sm"></i>
        </button>
    </div>
    
    <div class="flex flex-col gap-2">
        {#each tasks as task (task._id)}
            <Task key={task._id} {task} onEdit={openEditModal} onDelete={openDeleteModal}/>
        {:else}
            <div class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stone-200 bg-stone-50/50 px-4 py-6 text-center">
                <div class="rounded-full bg-stone-100 p-2 text-stone-400">
                    <i class="fa-solid fa-clipboard-list text-base"></i>
                </div>
                <p class="text-xs text-stone-500">No tasks yet</p>
            </div>
        {/each}
    </div>
</div>

<Modal
  isOpen={isModalOpen} close={closeModal} 
  title= {modalMode === "delete" ? "Delete Task" :
          modalMode === "create" ? "Add New Item" :
          "Edit Item"}>
  
  {#if modalMode === "delete"}
    <div class="text-center">
      <div
        class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600"
      >
        <i class="fa-solid fa-trash-can text-lg"></i>
      </div>
      <p class="mb-6 text-stone-600">
        Are you sure you want to delete <strong class="text-stone-900"
          >{selectedTask.name}</strong
        >? This action cannot be undone.
      </p>
      <div class="flex justify-end gap-3">
        <button
          onclick={handleSubmit}
          class="rounded-xl bg-red-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-red-600 hover:shadow-md"
        >
          Delete Item
        </button>
      </div>
    </div>
  {:else}
    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-x-4">
      <div>
        <label
          for="name"
          class="mb-1.5 block text-sm font-semibold text-stone-700">Name
        </label>
        
        <input
          type="text"
          id="name"
          bind:value={formDataTask.name}
          required
          class="w-full rounded-lg border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-lime-300 focus:bg-white focus:ring-2 focus:ring-lime-100 focus:outline-none transition-all"
          placeholder="e.g. Watering plants"
        />

        <label
          for="description"
          class="mb-1.5 mt-1.5 block text-sm font-semibold text-stone-700">
          Description
        </label>

        <textarea
          id="description"
          bind:value={formDataTask.description}
          rows="4"
          class="w-full rounded-lg border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-lime-300 focus:bg-white focus:ring-2 focus:ring-lime-100 focus:outline-none transition-all resize-y"
          placeholder="e.g. Describe what is the task about ...">
        </textarea>
      </div>
      <div>
        <label
          for="isComplete"
          class="mb-1.5 block text-sm font-semibold text-stone-700"
        >
          Is your task already <span class="font-extrabold">completed</span> ??
        </label>
        <input
          type="checkbox"
          id="isComplete"
          bind:checked={formDataTask.isComplete}
          onclick={toggleCheck}
          class="h-5 w-5 rounded-md border-stone-300 text-lime-600 focus:ring-lime-500 transition-all cursor-pointer"
        />
      </div>
      <div class="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          class="rounded-xl bg-lime-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-lime-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50">
          {modalMode === "create" ? "Add Item" : "Save Changes"}
        </button>
      </div>
    </form>
  {/if}
</Modal>
