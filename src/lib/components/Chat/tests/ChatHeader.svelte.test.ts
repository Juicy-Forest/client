import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import ChatHeader from "../ChatHeader.svelte";

describe("ChatHeader", () => {
  it("renders channel name with hashtag", () => {
    render(ChatHeader, {
      // @ts-ignore
      props: { activeChannel: { id: "ch1", name: "general" } },
    });
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "#general",
    );
  });

  it("renders different channel names", () => {
    render(ChatHeader, {
      // @ts-ignore
      props: { activeChannel: { id: "ch2", name: "announcements" } },
    });
    expect(screen.getByText("#announcements")).toBeInTheDocument();
  });
});
