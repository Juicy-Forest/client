//@ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import TaskComponent from './Task.svelte';

describe('TaskComponent', () => {
  const mockTask = {
    id: 1,
    name: 'Test Task',
    description: 'This is a short description',
    isComplete: false
  };

  const mockTaskLongDescription = {
    id: 2,
    name: 'Task with Long Description',
    description: 'This is a very long description that exceeds fifty characters to test the expand/collapse functionality',
    isComplete: true
  };

  it('renders task name and description', () => {
    const onEdit = () => {};
    const onDelete = () => {};
    const onCheck = () => {};

    render(TaskComponent, {
      props: {
        task: mockTask,
        onEdit,
        onDelete,
        onCheck
      }
    });

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a short description')).toBeInTheDocument();
  });

  it('renders checkbox with correct checked state', () => {
    const onEdit = () => {};
    const onDelete = () => {};
    const onCheck = () => {};

    render(TaskComponent, {
      props: {
        task: mockTask,
        onEdit,
        onDelete,
        onCheck
      }
    });

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders checkbox as checked when task is complete', () => {
    const onEdit = () => {};
    const onDelete = () => {};
    const onCheck = () => {};

    render(TaskComponent, {
      props: {
        task: mockTaskLongDescription,
        onEdit,
        onDelete,
        onCheck
      }
    });

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    let editedTask = null;
    const onEdit = (task) => { editedTask = task; };
    const onDelete = () => {};
    const onCheck = () => {};

    render(TaskComponent, {
      props: {
        task: mockTask,
        onEdit,
        onDelete,
        onCheck
      }
    });

    const editButton = screen.getByLabelText('Edit');
    await user.click(editButton);

    expect(editedTask).toEqual(mockTask);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    let deletedTask = null;
    const onDelete = (task) => { deletedTask = task; };
    const onEdit = () => {};
    const onCheck = () => {};

    render(TaskComponent, {
      props: {
        task: mockTask,
        onEdit,
        onDelete,
        onCheck
      }
    });

    const deleteButton = screen.getByLabelText('Delete');
    await user.click(deleteButton);

    expect(deletedTask).toEqual(mockTask);
  });

  it('does not show expand/collapse button for short descriptions', () => {
    const onEdit = () => {};
    const onDelete = () => {};
    const onCheck = () => {};

    render(TaskComponent, {
      props: {
        task: mockTask,
        onEdit,
        onDelete,
        onCheck
      }
    });

    expect(screen.queryByText(/See more/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/See less/i)).not.toBeInTheDocument();
  });

  it('shows "See more" button for long descriptions', () => {
    const onEdit = () => {};
    const onDelete = () => {};
    const onCheck = () => {};

    render(TaskComponent, {
      props: {
        task: mockTaskLongDescription,
        onEdit,
        onDelete,
        onCheck
      }
    });

    expect(screen.getByText('See more ▼')).toBeInTheDocument();
  });

  it('toggles between "See more" and "See less" when clicked', async () => {
    const user = userEvent.setup();
    const onEdit = () => {};
    const onDelete = () => {};
    const onCheck = () => {};

    render(TaskComponent, {
      props: {
        task: mockTaskLongDescription,
        onEdit,
        onDelete,
        onCheck
      }
    });

    const expandButton = screen.getByText('See more ▼');
    await user.click(expandButton);

    expect(screen.getByText('See less ▲')).toBeInTheDocument();
    expect(screen.queryByText('See more ▼')).not.toBeInTheDocument();

    const collapseButton = screen.getByText('See less ▲');
    await user.click(collapseButton);

    expect(screen.getByText('See more ▼')).toBeInTheDocument();
    expect(screen.queryByText('See less ▲')).not.toBeInTheDocument();
  });
});
