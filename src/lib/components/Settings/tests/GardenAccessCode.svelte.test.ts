import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import GardenAccessCode from "../GardenAccessCode.svelte";

describe("GardenAccessCode", () => {
  const mockJoinCode = "ABC123XYZ";

  const renderComponent = () =>
    render(GardenAccessCode, {
      props: {
        joinCode: mockJoinCode,
      },
    });

  it("renders garden access code title", () => {
    renderComponent();
    expect(screen.getByText("Garden Access Code")).toBeInTheDocument();
  });

  it("displays the join code", () => {
    renderComponent();
    expect(screen.getByText(mockJoinCode)).toBeInTheDocument();
  });

  it("displays help text about sharing the code", () => {
    renderComponent();
    expect(screen.getByText(/Share this code with others/)).toBeInTheDocument();
  });

  it("has a copy button", () => {
    renderComponent();
    expect(screen.getByRole("button", { name: /Copy/ })).toBeInTheDocument();
  });

  it('displays "Loading..." when joinCode is not provided', () => {
    render(GardenAccessCode, {
      props: {
        joinCode: "",
      },
    });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows rounded container styling", () => {
    const { container } = renderComponent();
    const wrapper = container.querySelector("div");
    expect(wrapper).toHaveClass(
      "rounded-2xl",
      "border",
      "border-stone-200",
      "bg-white",
    );
  });
});
