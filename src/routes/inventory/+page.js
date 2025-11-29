const apiUrl = 'http://localhost:3030/inventory/'

export const load = async ({fetch}) => {
    const inventoryItems = await fetch(apiUrl);
    const inventoryItemsJson = await inventoryItems.json()
    return {inventory: inventoryItemsJson}
}