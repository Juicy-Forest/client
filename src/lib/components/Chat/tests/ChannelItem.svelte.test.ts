import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import ChannelItem from "../ChannelItem.svelte";

describe("ChannelItem", () => {
  let mockClickHandler: ReturnType<typeof vi.fn>;
  const mockChannel = { _id: "ch1", name: "general" };

  beforeEach(() => {
    mockClickHandler = vi.fn();
  });

  const renderChannel = (channel = mockChannel, isActive = false) =>
    render(ChannelItem, {
      props: { channel, isActive, clickHandler: mockClickHandler },
    });

  it("renders channel name with hashtag", () => {
    renderChannel();
    expect(screen.getByText("#general")).toBeInTheDocument();
  });

  it("triggers clickHandler when clicked", async () => {
    const user = userEvent.setup();
    renderChannel();

    await user.click(screen.getByRole("button"));

    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });
});
