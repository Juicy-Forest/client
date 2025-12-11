<script>
    
    const {task, onEdit, onDelete, onCheck, onDesc} = $props();

</script>

<div class="flex justify-between w-auto h-auto shadow-xl bg-gray-50 m-1 items-center rounded-lg">
    <div class="flex justify-between w-auto h-auto items-center">
        <input type="checkbox" id="isComplete" checked={task.isComplete} onclick={() => onCheck(task)}
          class="h-5 w-5 m-5 rounded-md border-stone-300 text-lime-600 focus:ring-lime-500 transition-all cursor-pointer"
        />
        <div class="flex flex-col">
            <p class="text-lime-600 font-bold">{task.name}</p>
            <div class="flex justify-between items-center">
                <p class="line-clamp-1">{task.description}</p>
            </div>
        </div>
    </div>
    <div class="mr-2 flex justify-between">
        <button class="w-auto h-auto m-2 p-2 rounded-lg hover:bg-gray-200" aria-label="More info"
            onclick={() => onDesc(task)}>
            <i class="fa-solid fa-arrow-up-right-from-square "></i>
        </button>
        <button class="w-auto h-auto m-2 p-2 rounded-lg hover:bg-blue-200" aria-label="Edit"
            onclick={() => onEdit(task)}>
            <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="w-auto h-auto m-2 p-2 rounded-lg hover:bg-red-200" aria-label="Delete"
            onclick={() => onDelete(task)}>
            <i class="fa-solid fa-trash-can"></i>
        </button>
    </div>
</div>
