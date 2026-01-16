//@ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import TaskSection from "../TaskSection.svelte";

vi.mock("$app/navigation", () => ({
  invalidateAll: vi.fn(),
}));

describe("TaskSection", () => {
  let mockFetch;
  const mockSection = { _id: "sec1", title: "My Tasks", assigned: "John Doe" };
  const mockTasks = [
    {
      _id: "1",
      name: "Task 1",
      description: "Description 1",
      isComplete: false,
    },
    {
      _id: "2",
      name: "Task 2",
      description: "Description 2",
      isComplete: true,
    },
  ];

  beforeEach(() => {
    mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  const renderSection = (tasks = mockTasks) =>
    render(TaskSection, { props: { section: mockSection, data: {}, tasks } });

  it("renders section title and assigned user", () => {
    renderSection();

    expect(screen.getByText("My Tasks")).toBeInTheDocument();
    expect(screen.getByText("Assigned to John Doe")).toBeInTheDocument();
  });

  it("renders all tasks in the section", () => {
    renderSection();

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("opens create modal when Add Task button is clicked", async () => {
    const user = userEvent.setup();
    renderSection();

    await user.click(screen.getByLabelText("Add task"));

    expect(screen.getByText("Add New Item")).toBeInTheDocument();
  });

  it("opens edit modal with task data", async () => {
    const user = userEvent.setup();
    renderSection();

    const editButtons = screen.getAllByLabelText("Edit");
    await user.click(editButtons[0]);

    expect(screen.getByText("Edit Item")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Task 1")).toBeInTheDocument();
  });

  it("creates new task on submit", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: true });
    renderSection();

    await user.click(screen.getByLabelText("Add task"));
    await user.type(screen.getByLabelText(/Name/i), "New Task");
    await user.click(screen.getByRole("button", { name: "Add Item" }));

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3030/tasks/",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("deletes task when confirmed", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: true });
    renderSection();

    const deleteButtons = screen.getAllByLabelText("Delete");
    await user.click(deleteButtons[0]);
    await user.click(screen.getByRole("button", { name: "Delete Item" }));

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3030/tasks/1",
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
