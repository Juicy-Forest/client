import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import InventoryFilter from '../InventoryFilter.svelte';

describe('InventoryFilter', () => {
    let contextValue;

    beforeEach(() => {
        contextValue = { selectedInventoryType: 'all' };
    });

    const renderComponent = (initial = 'all') => {
        contextValue.selectedInventoryType = initial;
        return render(InventoryFilter, {
            context: new Map([['selectedInventoryType', contextValue]])
        });
    };

    it('updates the context state when different filters are clicked', async () => {
        const user = userEvent.setup();
        renderComponent();

        await user.click(screen.getByText('Plants'));
        expect(contextValue.selectedInventoryType).toBe('plant');

        await user.click(screen.getByText('Important items'));
        expect(contextValue.selectedInventoryType).toBe(true);

        await user.click(screen.getByText('All Items'));
        expect(contextValue.selectedInventoryType).toBe('all');
    });

    it('initializes correctly based on provided context', () => {
        renderComponent('seed');
        expect(contextValue.selectedInventoryType).toBe('seed');
    });
});