const apiUrl = 'http://localhost:3030/inventory/';

export const load = async ({fetch}) => {
    try {
        const inventoryItems = await fetch(apiUrl);
        const inventoryItemsJson = await inventoryItems.json();
        return {inventory: inventoryItemsJson};
    } catch (error) {
        console.log(error);
    }
};