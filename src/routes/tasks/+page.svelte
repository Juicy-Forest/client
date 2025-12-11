<script>
  //@ts-nocheck
  import { invalidateAll } from "$app/navigation";
  import Task from "$lib/components/Tasks/Task.svelte";
  import Modal from "$lib/components/util/Modal.svelte";

  let { data } = $props();

  let modalMode = $state("create");
  let selectedTask = $state(null);
  let isModalOpen = $state(false);

  let formDataTask = $state({
    name: "",
    description: "",
    isComplete: false,
  });

  async function toggleCheck(task){
    const baseUrl = "http://localhost:3030/tasks/";
      try {
        let response;
          response = await fetch(`${baseUrl}${task._id}/toggle`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
          });
          if(response.ok) {
            invalidateAll();
          }
      } catch (error) {
        console.error(error)
      }
  }

  function openDescModal(task){
    selectedTask = task;
    modalMode = "description";
    isModalOpen = true;
  }

  function resetForm() {
    formDataTask = {
      name: "",
      description: "",
      isComplete: false,
    };
    selectedTask = null;
  }

  function openCreateModal() {
    resetForm();
    modalMode = "create";
    isModalOpen = true;
  }

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
        response = await fetch(`${baseUrl}${selectedTask._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataTask),
        });
      } else if (modalMode === "delete") {
        response = await fetch(`${baseUrl}${selectedTask._id}`, {
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
</script>

<section class="box-border min-h-screen bg-[#fdfcf8] px-4 pb-8 pt-12 text-stone-800 sm:px-8 lg:px-12">
  <div class="mx-auto grid w-full max-w-none items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
    <!-- Sidebar -->
    <aside class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-3xl border border-stone-200/60 bg-white/60 px-5 py-6 shadow-sm backdrop-blur-xl transition-colors hover:bg-white/80">
      <header class="mb-6 px-2">
        <p class="text-xs font-bold uppercase tracking-widest text-stone-400">
          Planning
        </p>
        <h1 class="mt-1 text-lg font-bold tracking-tight text-stone-800">
          Weekly Tasks
        </h1>
        <p class="text-sm text-gray-600 leading-relaxed">
          Manage weekly garden tasks. All tasks are listed here for tracking.
        </p>
      </header>
      <div>
        <div class="text-xs font-semibold text-gray-400 tracking-wider mb-3">
          ACTIONS
        </div>
        <div
          class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center mb-3"
        >
          <div class="text-xs text-gray-400 mb-2">NEXT RESET</div>
          <div class="text-lg font-semibold text-gray-900">7 days</div>
        </div>
        <button
          class="w-full py-2.5 px-4 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all">
          Reset All Tasks
        </button>
      </div>
    </aside>
    <!--Main Content-->
    <main class="flex-1 p-8">
      <div class="flex h-[calc(100vh-10.5rem)] flex-col overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-white/80 shadow-xl shadow-stone-200/20 backdrop-blur-xl">
        <!-- Header -->
        <header class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-white/50 px-8 py-5 backdrop-blur-sm">
          <div class="w-full flex justify-between items-start mb-8">
            <div>
              <h2 class="text-2xl font-semibold text-gray-900">
                All Tasks <span class="text-gray-400">/ Garden 1</span>
              </h2>
              <p class="text-sm text-gray-600">
                Overview of all active and completed tasks.
              </p>
            </div>
            <button
              class="flex gap-2 rounded-xl bg-lime-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-lime-700 hover:shadow-md"
              onclick={openCreateModal}>
              <i class="fa-solid fa-plus"></i>Add Task
            </button>
          </div>
        </header>
        <div class="flex flex-1 flex-col overflow-hidden bg-stone-50/30">
          <div class="flex-1 overflow-y-auto px-8 py-6">
            <div class="flex flex-col gap-2 shadow-xl p-5 rounded-2xl">
              {#each data.tasks as task}
                <Task {task} onEdit={openEditModal} onDelete={openDeleteModal} onCheck={toggleCheck} onDesc={openDescModal}/>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</section>
<Modal
  isOpen={isModalOpen}
  close={closeModal}
  title={modalMode === "delete"
    ? "Delete Task"
    : modalMode === "create"
      ? "Add New Item"
      : modalMode === "edit" ? "Edit Item"
      : "Description"}
>
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
          onclick={closeModal}
          class="rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
        >
          Cancel
        </button>
        <button
          onclick={handleSubmit}
          class="rounded-xl bg-red-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-red-600 hover:shadow-md">
          Delete Item
        </button>
      </div>
    </div>
  {:else if modalMode === "description"}
      <div class="overflow-hidden rounded-lg border border-stone-200/60 shadow-xl shadow-stone-200/20 backdrop-blur- bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-lime-300 focus:bg-white focus:ring-2 focus:ring-lime-100 focus:outline-none transition-all resize-y">
        <label for="description">{selectedTask.description}</label>
      </div>
  {:else}
    <form onsubmit={(e) => {e.preventDefault();handleSubmit();}} class="space-x-4">
      <div>
        <label for="name" class="mb-1.5 block text-sm font-semibold text-stone-700">Name</label>
        <input type="text" id="name" bind:value={formDataTask.name} required
          class="w-full rounded-lg border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-lime-300 focus:bg-white focus:ring-2 focus:ring-lime-100 focus:outline-none transition-all"
          placeholder="e.g. Watering plants"
        />
        <label for="description"class="mb-1.5 mt-1.5 block text-sm font-semibold text-stone-700">Description</label>
        <textarea id="description" bind:value={formDataTask.description} rows="4"
          class="w-full rounded-lg border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-lime-300 focus:bg-white focus:ring-2 focus:ring-lime-100 focus:outline-none transition-all resize-y"
          placeholder="e.g. Describe what is the task about ..."
        ></textarea>
      </div>
      <div>
        <label for="isComplete" class="mb-1.5 block text-sm font-semibold text-stone-700">
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
          type="button"
          onclick={closeModal}
          class="rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-xl bg-lime-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-lime-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {modalMode === "create" ? "Add Item" : "Save Changes"}
        </button>
      </div>
    </form>
  {/if}
</Modal>
