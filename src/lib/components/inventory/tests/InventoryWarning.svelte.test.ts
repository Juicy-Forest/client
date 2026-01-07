import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import InventoryWarning from '../InventoryWarning.svelte';

describe('InventoryWarning', () => {
  // Updated mock data to include the isImportant flag
  const mockInventory = [
    { _id: '1', name: 'Tomato Plant', quantity: 2, desiredQuantity: 10, isImportant: true },
    { _id: '2', name: 'Garden Hoe', quantity: 3, desiredQuantity: 3, isImportant: true },
  ];

  const renderComponent = (inventory = mockInventory) => 
    render(InventoryWarning, { props: { inventory } });

  it('renders only when items are below desired quantity AND important', () => {
    // Test case where item is low stock but NOT important (should not show)
    const { rerender } = renderComponent([
        { name: 'Ignore Me', quantity: 1, desiredQuantity: 10, isImportant: false }
    ]);
    
    expect(screen.queryByRole('heading', { name: /Low Stock Alert/i })).not.toBeInTheDocument();

    // Rerender with valid mock data
    rerender({ inventory: mockInventory });

    expect(screen.getByRole('heading', { name: /Low Stock Alert/i })).toBeInTheDocument();
    expect(screen.getByText('1 important item below desired quantity')).toBeInTheDocument();
  });

  it('toggles the visibility of warning details', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Tomato Plant is visible because it is low stock AND isImportant: true
    expect(screen.getByText('Tomato Plant')).toBeInTheDocument();
    const toggleBtn = screen.getByRole('button', { name: /Hide/i });

    await user.click(toggleBtn);
    expect(screen.queryByText('Tomato Plant')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Show/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Show/i }));
    expect(screen.getByText('Tomato Plant')).toBeInTheDocument();
  });

  it('displays units and quantity levels correctly', () => {
    renderComponent([
      { 
        name: 'Basil', 
        quantity: 5, 
        desiredQuantity: 20, 
        quantityType: 'packets', 
        isImportant: true // Added flag here
      }
    ]);

    expect(screen.getByText('5 packets')).toBeInTheDocument();
    expect(screen.getByText('20 packets')).toBeInTheDocument();
  });

  // New specific test for the new logic
  it('does not display items that are low stock but not marked as important', () => {
    renderComponent([
      { name: 'Cheap Plastic Pot', quantity: 0, desiredQuantity: 10, isImportant: false }
    ]);

    expect(screen.queryByText('Cheap Plastic Pot')).not.toBeInTheDocument();
    expect(screen.queryByText(/Low Stock Alert/i)).not.toBeInTheDocument();
  });
});