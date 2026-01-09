//@ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import TaskModal from '../TaskModel.svelte';

vi.mock('$app/navigation', () => ({
  invalidateAll: vi.fn()
}));

describe('TaskModal', () => {
  let mockFetch;
  const mockTask = { _id: '123', name: 'Water plants', description: 'Water all the plants', isComplete: false };

  beforeEach(() => {
    mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  const renderModal = (mode = 'create', formData = { name: '', description: '', isComplete: false }) => 
    render(TaskModal, { props: { task: mockTask, isModalOpen: true, modalMode: mode, selectedTask: mockTask, formDataTask: formData } });

  it('renders create modal correctly', () => {
    renderModal('create');
    expect(screen.getByText('Add New Item')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument();
  });

  it('renders edit modal correctly', () => {
    renderModal('edit');
    expect(screen.getByText('Edit Item')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
  });

  it('renders delete confirmation correctly', () => {
    renderModal('delete');
    expect(screen.getByText('Delete Task')).toBeInTheDocument();
    expect(screen.getByText(mockTask.name)).toBeInTheDocument();
  });

  it('creates new task on submit', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: true });
    const formData = { name: 'New Task', description: 'Test', isComplete: false };
    
    renderModal('create', formData);
    await user.click(screen.getByRole('button', { name: 'Add Item' }));
    
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3030/tasks/', 
      expect.objectContaining({ method: 'POST', body: JSON.stringify(formData) }));
  });

  it('updates task on edit', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: true });
    
    renderModal('edit', { name: 'Updated', description: 'Updated desc', isComplete: false });
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));
    
    expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3030/tasks/${mockTask._id}`, 
      expect.objectContaining({ method: 'PUT' }));
  });

  it('deletes task when confirmed', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: true });
    
    renderModal('delete');
    await user.click(screen.getByRole('button', { name: 'Delete Item' }));
    
    expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3030/tasks/${mockTask._id}`, 
      expect.objectContaining({ method: 'DELETE' }));
  });

  it('toggles task completion', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: true });
    
    renderModal('edit');
    await user.click(screen.getByRole('checkbox'));
    
    expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3030/tasks/${mockTask._id}/toggle`, 
      expect.objectContaining({ method: 'PUT' }));
  });
});
