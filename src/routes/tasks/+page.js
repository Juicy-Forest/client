const apiUrl = 'http://localhost:3030/tasks/';

export const load = async ({fetch}) => {
    const tasksItems = await fetch(apiUrl);
    const tasksItemsJson = await tasksItems.json();
    return {tasks: tasksItemsJson};
};

