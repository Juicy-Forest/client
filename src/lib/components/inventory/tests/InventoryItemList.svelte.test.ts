import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import InventoryItemList from '../InventoryItemList.svelte';

vi.mock('../InventoryItem.svelte', () => ({
  default: vi.fn(() => ({ $$: {}, $set: vi.fn(), $on: vi.fn(), $destroy: vi.fn() }))
}));

describe('InventoryItemList', () => {
  const mockInventory = [
    { _id: '1', name: 'Tomato Plant', type: 'plant', isImportant: true },
    { _id: '2', name: 'Basil Seeds', type: 'seed', isImportant: false },
  ];

  let selectedInventoryType, searchBarInput;

  beforeEach(() => {
    selectedInventoryType = { selectedInventoryType: 'all' };
    searchBarInput = { value: '' };
  });

  const renderComponent = (inventory = mockInventory) => render(InventoryItemList, {
    props: { inventory },
    context: new Map([
      ['selectedInventoryType', selectedInventoryType],
      ['inventorySearchBarInput', searchBarInput]
    ])
  });

  it('filters items correctly based on category and search text', () => {
    selectedInventoryType.selectedInventoryType = 'seed';
    const { rerender } = renderComponent();
    expect(screen.queryByText('No items found in this category.')).not.toBeInTheDocument();

    searchBarInput.value = 'Non-existent';
    rerender({ inventory: mockInventory });
    expect(screen.getByText('No items found in this category.')).toBeInTheDocument();

    selectedInventoryType.selectedInventoryType = 'seed';
    searchBarInput.value = 'Tomato';
    rerender({ inventory: mockInventory });
    expect(screen.getByText('No items found in this category.')).toBeInTheDocument();
  });

  it('displays empty state when inventory prop is empty', () => {
    renderComponent([]);
    expect(screen.getByText('No items found in this category.')).toBeInTheDocument();
  });

  it('is case-sensitive in search logic', () => {
    searchBarInput.value = 'tomato';
    renderComponent();
    expect(screen.getByText('No items found in this category.')).toBeInTheDocument();
  });
});