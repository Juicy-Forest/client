//@ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import TaskComponent from "../Task.svelte";

describe("TaskComponent", () => {
  let mockOnEdit, mockOnDelete, mockOnCheck;
  const mockTask = {
    id: 1,
    name: "Test Task",
    description: "Short description",
    isComplete: false,
  };
  const mockTaskLong = {
    id: 2,
    name: "Long Task",
    description:
      "This is a very long description that exceeds fifty characters to test expand functionality",
    isComplete: true,
  };

  beforeEach(() => {
    mockOnEdit = vi.fn();
    mockOnDelete = vi.fn();
    mockOnCheck = vi.fn();
  });

  const renderTask = (task = mockTask) =>
    render(TaskComponent, {
      props: {
        task,
        onEdit: mockOnEdit,
        onDelete: mockOnDelete,
        onCheck: mockOnCheck,
      },
    });

  it("renders task data correctly", () => {
    renderTask();

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Short description")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("renders checked checkbox when task is complete", () => {
    renderTask(mockTaskLong);

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("triggers onEdit when edit button clicked", async () => {
    const user = userEvent.setup();
    renderTask();

    await user.click(screen.getByLabelText("Edit"));
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it("triggers onDelete when delete button clicked", async () => {
    const user = userEvent.setup();
    renderTask();

    await user.click(screen.getByLabelText("Delete"));
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask);
  });

  it("does not show expand button for short descriptions", () => {
    renderTask();

    expect(screen.queryByText(/Show more/i)).not.toBeInTheDocument();
  });

  it("shows and toggles expand/collapse for long descriptions", async () => {
    const user = userEvent.setup();
    renderTask(mockTaskLong);

    expect(screen.getByText("Show more")).toBeInTheDocument();

    await user.click(screen.getByText("Show more"));
    expect(screen.getByText("Show less")).toBeInTheDocument();

    await user.click(screen.getByText("Show less"));
    expect(screen.getByText("Show more")).toBeInTheDocument();
  });
});
