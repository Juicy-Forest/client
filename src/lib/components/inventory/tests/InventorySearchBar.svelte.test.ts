import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import InventorySearchBar from '../InventorySearchBar.svelte';

describe('InventorySearchBar', () => {
    let searchBarInput;

    beforeEach(() => {
        searchBarInput = { value: '' };
    });

    const renderComponent = (initialValue = '') => {
        searchBarInput.value = initialValue;
        return render(InventorySearchBar, {
            context: new Map([['inventorySearchBarInput', searchBarInput]])
        });
    };

    it('initializes with context value and updates on user input', async () => {
        const user = userEvent.setup();
        renderComponent('Initial');
    
        const input = screen.getByPlaceholderText('Search items...');
    
        expect(input).toHaveValue('Initial');

        await user.clear(input);
        await user.type(input, 'New Value');
    
        expect(searchBarInput.value).toBe('New Value');
    });

    it('handles character deletion correctly', async () => {
        const user = userEvent.setup();
        renderComponent('Test');
    
        const input = screen.getByPlaceholderText('Search items...');
        await user.type(input, '{Backspace}{Backspace}');
    
        expect(searchBarInput.value).toBe('Te');
    });
});