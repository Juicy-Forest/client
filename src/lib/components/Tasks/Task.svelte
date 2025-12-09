<script>
    
    const {task, onEdit, onDelete} = $props();

</script>

<div class="flex justify-between w-full h-auto bg-gray-300 m-5 p-5">
    <div>
        <p>{task.name}</p>
        <p>{task.isComplete}</p>
    </div>
    <div>
        <button class="w-auto h-auto p-5 bg-blue-600" onclick={() => onEdit(task)}>Edit</button>

        <button class="w-auto h-auto p-5 bg-red-600" onclick={() => onDelete(task)}>Delete</button>
    </div>
</div>
