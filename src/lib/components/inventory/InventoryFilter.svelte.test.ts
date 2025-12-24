import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import InventoryFilter from './InventoryFilter.svelte';

describe('InventoryFilter', () => {
  it('renders all filter buttons', () => {
    const selectedInventoryType = { selectedInventoryType: 'all' };
    
    render(InventoryFilter, {
      props: {},
      context: new Map([['selectedInventoryType', selectedInventoryType]])
    });

    expect(screen.getByText('All Items')).toBeInTheDocument();
    expect(screen.getByText('Important items')).toBeInTheDocument();
    expect(screen.getByText('Plants')).toBeInTheDocument();
    expect(screen.getByText('Seeds')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();
    expect(screen.getByText('Supplies')).toBeInTheDocument();
  });

  it('updates selectedInventoryType when button is clicked', async () => {
    const user = userEvent.setup();
    const selectedInventoryType = { selectedInventoryType: 'all' };
    
    render(InventoryFilter, {
      props: {},
      context: new Map([['selectedInventoryType', selectedInventoryType]])
    });

    const plantsButton = screen.getByText('Plants');
    await user.click(plantsButton);
    
    expect(selectedInventoryType.selectedInventoryType).toBe('plant');
  });

  it('updates to different inventory types correctly', async () => {
    const user = userEvent.setup();
    const selectedInventoryType = { selectedInventoryType: 'all' };
    
    render(InventoryFilter, {
      props: {},
      context: new Map([['selectedInventoryType', selectedInventoryType]])
    });

    await user.click(screen.getByText('Seeds'));
    expect(selectedInventoryType.selectedInventoryType).toBe('seed');
    
    await user.click(screen.getByText('Tools'));
    expect(selectedInventoryType.selectedInventoryType).toBe('tool');
    
    await user.click(screen.getByText('Supplies'));
    expect(selectedInventoryType.selectedInventoryType).toBe('supply');
  });

  it('filters by important items', async () => {
    const user = userEvent.setup();
    const selectedInventoryType = { selectedInventoryType: 'all' };
    
    render(InventoryFilter, {
      props: {},
      context: new Map([['selectedInventoryType', selectedInventoryType]])
    });

    await user.click(screen.getByText('Important items'));
    expect(selectedInventoryType.selectedInventoryType).toBe(true);
  });
});