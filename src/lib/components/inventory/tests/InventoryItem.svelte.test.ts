import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import InventoryItem from '../InventoryItem.svelte';

describe('InventoryItem', () => {
  let mockOnEdit, mockOnDelete;
  const mockItem = { type: 'plant', name: 'Tomato', quantity: 5, quantityType: 'pots', isImportant: true };

  beforeEach(() => {
    mockOnEdit = vi.fn();
    mockOnDelete = vi.fn();
  });

  const renderItem = (item = mockItem) => 
    render(InventoryItem, { props: { item, onEdit: mockOnEdit, onDelete: mockOnDelete } });

  it('renders all item data correctly', () => {
    renderItem();
    
    // Core Logic: Does the data show up?
    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.getByText('Important')).toBeInTheDocument(); // Important badge
    expect(screen.getByText('plant')).toBeInTheDocument(); // Type badge
    expect(screen.getByText(/5/)).toBeInTheDocument(); // Quantity
    expect(screen.getByText(/pots/)).toBeInTheDocument(); // Quantity type
  });

  it('triggers onEdit with item data', async () => {
    const user = userEvent.setup();
    renderItem();

    await user.click(screen.getByRole('button', { name: 'Edit item' }));

    expect(mockOnEdit).toHaveBeenCalledWith(mockItem);
  });

  it('triggers onDelete with item data', async () => {
    const user = userEvent.setup();
    renderItem();

    await user.click(screen.getByRole('button', { name: 'Delete item' }));

    expect(mockOnDelete).toHaveBeenCalledWith(mockItem);
  });
});