import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import MessageEditForm from '../MessageEditForm.svelte';

describe('MessageEditForm', () => {
    let mockOnSave: ReturnType<typeof vi.fn>;
    let mockOnCancel: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockOnSave = vi.fn();
        mockOnCancel = vi.fn();
    });

    const renderForm = (initialContent = 'Original message') =>
        render(MessageEditForm, {
            props: { initialContent, onSave: mockOnSave, onCancel: mockOnCancel }
        });

    it('renders textarea with initial content', () => {
        renderForm('Hello world');
        expect(screen.getByRole('textbox')).toHaveValue('Hello world');
    });

    it('calls onSave with trimmed content when Save is clicked', async () => {
        const user = userEvent.setup();
        renderForm('Original');

        const textarea = screen.getByRole('textbox');
        await user.clear(textarea);
        await user.type(textarea, '  Updated content  ');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(mockOnSave).toHaveBeenCalledWith('Updated content');
    });

    it('calls onCancel when Cancel is clicked', async () => {
        const user = userEvent.setup();
        renderForm();

        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(mockOnCancel).toHaveBeenCalled();
    });

    it('calls onSave on Enter key', async () => {
        const user = userEvent.setup();
        renderForm('Original');

        const textarea = screen.getByRole('textbox');
        await user.clear(textarea);
        await user.type(textarea, 'New content');
        await user.keyboard('{Enter}');

        expect(mockOnSave).toHaveBeenCalledWith('New content');
    });

    it('calls onCancel on Escape key', async () => {
        const user = userEvent.setup();
        renderForm();

        await user.click(screen.getByRole('textbox'));
        await user.keyboard('{Escape}');

        expect(mockOnCancel).toHaveBeenCalled();
    });
});
