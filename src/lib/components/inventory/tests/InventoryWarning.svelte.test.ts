import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import InventoryWarning from '../InventoryWarning.svelte';

describe('InventoryWarning', () => {
  const mockInventory = [
    { _id: '1', name: 'Tomato Plant', quantity: 2, desiredQuantity: 10 },
    { _id: '2', name: 'Garden Hoe', quantity: 3, desiredQuantity: 3 },
  ];

  const renderComponent = (inventory = mockInventory) => 
    render(InventoryWarning, { props: { inventory } });

it('renders only when items are below desired quantity', () => {
    const { rerender } = renderComponent([{ name: 'Good', quantity: 5, desiredQuantity: 5 }]);
    
    expect(screen.queryByRole('heading', { name: /Low Stock Alert/i })).not.toBeInTheDocument();

    rerender({ inventory: mockInventory });

    expect(screen.getByRole('heading', { name: /Low Stock Alert/i })).toBeInTheDocument();
    expect(screen.getByText('1 important item below desired quantity')).toBeInTheDocument();
  });

  it('toggles the visibility of warning details', async () => {
    const user = userEvent.setup();
    renderComponent();

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
      { name: 'Basil', quantity: 5, desiredQuantity: 20, quantityType: 'packets' }
    ]);

    expect(screen.getByText('5 packets')).toBeInTheDocument();
    expect(screen.getByText('20 packets')).toBeInTheDocument();
  });
});