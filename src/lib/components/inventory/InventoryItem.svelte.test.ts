import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import InventoryItem from './InventoryItem.svelte';

describe('InventoryItem', () => {
  const mockItem = {
    type: 'plant',
    name: 'Tomato',
    quantity: 5
  };

  it('renders item details correctly', () => {
    render(InventoryItem, {
      props: { item: mockItem }
    });

    expect(screen.getByText('Type:', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('plant')).toBeInTheDocument();
    expect(screen.getByText('Name:', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.getByText('Quantity:', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders Edit and Delete buttons', () => {
    render(InventoryItem, {
      props: { item: mockItem }
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
      props: { item: seedItem }
    });

    expect(screen.getByText('seed')).toBeInTheDocument();
    expect(screen.getByText('Carrot Seeds')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('renders tool items correctly', () => {
    const toolItem = {
      type: 'tool',
      name: 'Shovel',
      quantity: 2
    };

    render(InventoryItem, {
      props: { item: toolItem }
    });

    expect(screen.getByText('tool')).toBeInTheDocument();
    expect(screen.getByText('Shovel')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('Edit button is clickable', async () => {
    const user = userEvent.setup();
    
    render(InventoryItem, {
      props: { item: mockItem }
    });

    const editButton = screen.getByText('Edit');
    await user.click(editButton);
    
    // Button should still be in document after click
    expect(editButton).toBeInTheDocument();
  });

  it('Delete button is clickable', async () => {
    const user = userEvent.setup();
    
    render(InventoryItem, {
      props: { item: mockItem }
    });

    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);
    
    // Button should still be in document after click
    expect(deleteButton).toBeInTheDocument();
  });

  it('handles items with zero quantity', () => {
    const emptyItem = {
      type: 'supply',
      name: 'Fertilizer',
      quantity: 0
    };

    render(InventoryItem, {
      props: { item: emptyItem }
    });

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});