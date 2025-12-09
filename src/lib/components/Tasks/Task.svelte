<script>
    
    const {task, onEdit, onDelete} = $props();

</script>

<div class="flex justify-between w-full h-auto bg-gray-200 p-5 rounded-full">
    <div>
        <p>{task.name}</p>
    </div>
    <div>
        <button class="w-auto h-auto p-2 rounded-full hover:bg-blue-200" onclick={() => onEdit(task)}>
            <i class="fa-solid fa-pen-to-square"></i>
            Edit
        </button>
        <button class="w-auto h-auto p-2 rounded-full hover:bg-red-200" onclick={() => onDelete(task)}>
            <i class="fa-solid fa-trash-can"></i>
            Delete
        </button>
    </div>
</div>
