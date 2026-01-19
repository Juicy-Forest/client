<script>
    //@ts-nocheck
    import { invalidateAll } from '$app/navigation';

    const { task, onEdit, onDelete } = $props();

    let isExpanded = $state(false);

    function toggleExpand() {
        isExpanded = !isExpanded;
    }

    $effect(() => {
        console.log(`Task ${task._id} - isExpanded:`, isExpanded);
    });

    async function toggleCheck(task) {
        const baseUrl = 'http://localhost:3030/tasks/';
        try {
            const response = await fetch(`${baseUrl}${task._id}/toggle`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                invalidateAll();
            }
        } catch (error) {
            console.error(error);
        }
    }
</script>

<div
    class="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3 transition-colors hover:bg-stone-50/80"
>
    <div class="flex items-center gap-3 overflow-hidden">
        <input
            type="checkbox"
            id="isComplete"
            checked={task.isComplete}
            onclick={() => toggleCheck(task)}
            class="h-5 w-5 shrink-0 rounded-md border-stone-300 text-lime-600 focus:ring-lime-500 transition-all cursor-pointer"
        />
        <div class="flex flex-col min-w-0">
            <p
                class={`font-semibold text-sm ${task.isComplete ? 'text-stone-400 line-through' : 'text-stone-800'}`}
            >
                {task.name}
            </p>
            {#if task.description}
                <div class="relative">
                    <p
                        class={`text-xs leading-relaxed transition-all duration-300 ${isExpanded ? '' : 'max-h-8 overflow-hidden'} ${task.isComplete ? 'text-stone-400' : 'text-stone-500'}`}
                    >
                        {task.description}
                    </p>
                    {#if !isExpanded && task.description.length > 50}
                        <div
                            class="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"
                        ></div>
                    {/if}
                </div>
                {#if task.description.length > 50}
                    <button
                        onclick={toggleExpand}
                        class="mt-1 text-xs text-lime-600 hover:text-lime-700 font-medium transition-colors self-start"
                    >
                        {isExpanded ? 'Show less' : 'Show more'}
                    </button>
                {/if}
            {/if}
        </div>
    </div>
    <div class="flex shrink-0 gap-1">
        <button
            class="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-blue-100 hover:text-blue-600"
            aria-label="Edit"
            onclick={() => onEdit(task)}
        >
            <i class="fa-solid fa-pen-to-square text-sm"></i>
        </button>
        <button
            class="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-red-100 hover:text-red-600"
            aria-label="Delete"
            onclick={() => onDelete(task)}
        >
            <i class="fa-solid fa-trash-can text-sm"></i>
        </button>
    </div>
</div>
