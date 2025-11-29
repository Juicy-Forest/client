import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import InventoryItem from './InventoryItem.svelte';

describe('InventoryItem', () => {
  const mockItem = {
    type: 'plant',
    name: 'Tomato',
    quantity: 5
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it('renders item details correctly', () => {
    render(InventoryItem, {
      props: { 
        item: mockItem,
        onEdit: mockOnEdit,
        onDelete: mockOnDelete
      }
    });

    expect(screen.getByText('plant')).toBeInTheDocument();
    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.getByText('Quantity:', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('5', { exact: false })).toBeInTheDocument();
  });

  it('renders Edit and Delete buttons', () => {
    render(InventoryItem, {
      props: { 
        item: mockItem,
        onEdit: mockOnEdit,
        onDelete: mockOnDelete
      }
    });

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders different item types correctly', () => {
    const seedItem = {
      type: 'seed',
      name: 'Carrot Seeds',
      quantity: 20
    };

    render(InventoryItem, {
      props: { 
        item: seedItem,
        onEdit: mockOnEdit,
        onDelete: mockOnDelete
      }
    });

    expect(screen.getByText('seed')).toBeInTheDocument();
    expect(screen.getByText('Carrot Seeds')).toBeInTheDocument();
    expect(screen.getByText('20', { exact: false })).toBeInTheDocument();
  });

  it('renders tool items correctly', () => {
    const toolItem = {
      type: 'tool',
      name: 'Shovel',
      quantity: 2
    };

    render(InventoryItem, {
      props: { 
        item: toolItem,
        onEdit: mockOnEdit,
        onDelete: mockOnDelete
      }
    });

    expect(screen.getByText('tool')).toBeInTheDocument();
    expect(screen.getByText('Shovel')).toBeInTheDocument();
    expect(screen.getByText('2', { exact: false })).toBeInTheDocument();
  });

  it('renders quantityType when provided', () => {
    const itemWithQuantityType = {
      type: 'supply',
      name: 'Fertilizer',
      quantity: 10,
      quantityType: 'kg'
    };

    render(InventoryItem, {
      props: { 
        item: itemWithQuantityType,
        onEdit: mockOnEdit,
        onDelete: mockOnDelete
      }
    });

    expect(screen.getByText(/10 kg/)).toBeInTheDocument();
  });

  it('calls onEdit when Edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    
    render(InventoryItem, {
      props: { 
        item: mockItem,
        onEdit,
        onDelete: mockOnDelete
      }
    });

    const editButton = screen.getByText('Edit');
    await user.click(editButton);
    
    expect(onEdit).toHaveBeenCalledWith(mockItem);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when Delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    
    render(InventoryItem, {
      props: { 
        item: mockItem,
        onEdit: mockOnEdit,
        onDelete
      }
    });

    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);
    
    expect(onDelete).toHaveBeenCalledWith(mockItem);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('handles items with zero quantity', () => {
    const emptyItem = {
      type: 'supply',
      name: 'Fertilizer',
      quantity: 0
    };

    render(InventoryItem, {
      props: { 
        item: emptyItem,
        onEdit: mockOnEdit,
        onDelete: mockOnDelete
      }
    });

    expect(screen.getByText('0', { exact: false })).toBeInTheDocument();
  });
});