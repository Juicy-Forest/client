<script>
    
    const {task, onEdit, onDelete, onCheck} = $props();

let isExpanded =$state(false);

function toggleExpand(){
    isExpanded = !isExpanded;
}

</script>

<div class="flex justify-between w-auto h-auto shadow-xl bg-gray-50 m-1 items-center rounded-lg">
    <div class="flex justify-between w-auto h-auto items-center">
        <input type="checkbox" id="isComplete" checked={task.isComplete} onclick={() => onCheck(task)}
          class="h-5 w-5 m-5 rounded-md border-stone-300 text-lime-600 focus:ring-lime-500 transition-all cursor-pointer"
        />
        <div class="flex flex-col">
            <p class="text-lime-600 font-bold pt-2 mt-2">{task.name}</p>
            <div class="relative">
            <p class="text-gray-600 leading-relaxed overflow-hidden duration-300 ease-in-out {isExpanded ? 'max-h-auto' : 'max-h-9'}">
                {task.description}
            </p>
            {#if !isExpanded && task.description.length > 50}
                <div class="absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-gray-50 to-transparent pointer-events-none"></div>
            {/if}
        </div>
        {#if task.description.length > 50}
            <button 
                onclick={toggleExpand}
                class="mt-2 text-xs text-lime-600 hover:text-lime-700 font-semibold transition-colors self-start">
                {isExpanded ? 'See less ▲' : 'See more ▼'}
          </button>
        {/if}
        </div>
    </div>
    <div class="mr-2 flex justify-between">
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
