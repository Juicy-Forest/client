import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import InventoryForm from "../InventoryCreateEditModal.svelte";

describe("InventoryForm", () => {
  let mockFormData, mockOnCancel, mockOnSubmit;

  beforeEach(() => {
    mockFormData = {
      name: "",
      type: "plant",
      quantity: 0,
      quantityType: "",
      isImportant: false,
      desiredQuantity: 0,
    };
    mockOnCancel = vi.fn();
    mockOnSubmit = vi.fn();
  });

  const renderForm = (errors = {}) =>
    render(InventoryForm, {
      props: {
        formData: mockFormData,
        errors,
        onCancel: mockOnCancel,
        onSubmit: mockOnSubmit,
      },
    });

  it("updates data and triggers onSubmit on confirm", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Name"), "Rose Bush");
    const qtyInput = screen.getByLabelText("Quantity");
    await user.clear(qtyInput);
    await user.type(qtyInput, "15");

    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(mockFormData.name).toBe("Rose Bush");
    expect(mockFormData.quantity).toBe(15);
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("renders validation error messages", () => {
    renderForm({ name: "Name is required" });
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("triggers onCancel and ignores submission", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockOnCancel).toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
