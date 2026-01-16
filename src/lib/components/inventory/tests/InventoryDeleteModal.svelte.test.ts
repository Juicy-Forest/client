import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import DeleteConfirmation from "../InventoryDeleteModal.svelte";

describe("DeleteConfirmation", () => {
  const mockItem = { name: "Tomato Plant" };

  it("displays the item name and triggers onDelete", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(DeleteConfirmation, {
      props: { item: mockItem, onDelete, onCancel: vi.fn() },
    });

    expect(screen.getByText("Tomato Plant")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete Item" }));
    expect(onDelete).toHaveBeenCalled();
  });

  it("triggers onCancel when clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(DeleteConfirmation, {
      props: { item: mockItem, onDelete: vi.fn(), onCancel },
    });

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalled();
  });
});
