import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import InventoryHeader from "../InventoryHeader.svelte";
import { inventoryStore } from "$lib/stores/inventoryStore.svelte";

vi.mock("$lib/stores/inventoryStore.svelte", () => ({
  inventoryStore: { openCreateModal: vi.fn() },
}));

vi.mock("../InventoryWarning.svelte", () => ({ default: vi.fn() }));
vi.mock("../InventorySearchBar.svelte", () => ({ default: vi.fn() }));

describe("InventoryHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (inventory = []) =>
    render(InventoryHeader, { props: { inventory } });

  it("displays the correct item count", () => {
    //@ts-ignore
    const { rerender } = renderComponent([{ id: 1 }, { id: 2 }]);
    expect(screen.getByText("2 items")).toBeInTheDocument();

    rerender({ inventory: [] });
    expect(screen.getByText("0 items")).toBeInTheDocument();
  });

  it("opens the create modal when Add Item is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: /Add Item/i }));

    expect(inventoryStore.openCreateModal).toHaveBeenCalledTimes(1);
  });
});
