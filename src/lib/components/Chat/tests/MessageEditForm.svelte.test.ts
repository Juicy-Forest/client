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
      props: {
        initialContent,
        onSave: mockOnSave,
        onCancel: mockOnCancel
      }
    });

  it('renders textarea with initial content', () => {
    renderForm('Hello world');

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('Hello world');
  });

  it('renders Save and Cancel buttons', () => {
    renderForm();

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('renders keyboard hint text', () => {
    renderForm();

    expect(screen.getByText('Enter to save · Esc to cancel')).toBeInTheDocument();
  });

  it('calls onSave with new content when Save is clicked', async () => {
    const user = userEvent.setup();
    renderForm('Original');

    const textarea = screen.getByRole('textbox');
    await user.clear(textarea);
    await user.type(textarea, 'Updated content');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockOnSave).toHaveBeenCalledWith('Updated content');
  });

  it('calls onCancel when Cancel is clicked', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('calls onCancel when content is unchanged', async () => {
    const user = userEvent.setup();
    renderForm('Original');

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockOnCancel).toHaveBeenCalled();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('calls onCancel when content is only whitespace', async () => {
    const user = userEvent.setup();
    renderForm('Original');

    const textarea = screen.getByRole('textbox');
    await user.clear(textarea);
    await user.type(textarea, '   ');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockOnCancel).toHaveBeenCalled();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('trims whitespace from content before saving', async () => {
    const user = userEvent.setup();
    renderForm('Original');

    const textarea = screen.getByRole('textbox');
    await user.clear(textarea);
    await user.type(textarea, '  New content  ');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockOnSave).toHaveBeenCalledWith('New content');
  });

  it('calls onSave when Enter is pressed', async () => {
    const user = userEvent.setup();
    renderForm('Original');

    const textarea = screen.getByRole('textbox');
    await user.clear(textarea);
    await user.type(textarea, 'New content');
    await user.keyboard('{Enter}');

    expect(mockOnSave).toHaveBeenCalledWith('New content');
  });

  it('calls onCancel when Escape is pressed', async () => {
    const user = userEvent.setup();
    renderForm();

    const textarea = screen.getByRole('textbox');
    await user.click(textarea);
    await user.keyboard('{Escape}');

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('allows newline with Shift+Enter', async () => {
    const user = userEvent.setup();
    renderForm('Line 1');

    const textarea = screen.getByRole('textbox');
    await user.clear(textarea);
    await user.type(textarea, 'Line 1');
    await user.keyboard('{Shift>}{Enter}{/Shift}');
    await user.type(textarea, 'Line 2');

    expect(textarea).toHaveValue('Line 1\nLine 2');
    expect(mockOnSave).not.toHaveBeenCalled();
  });
});

