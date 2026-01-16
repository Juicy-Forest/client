import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import Avatar from "../Avatar.svelte";

describe("Avatar", () => {
  it("renders initials from username", () => {
    render(Avatar, {
      props: {
        author: { username: "John Doe", avatarColor: "#ff5733" },
        isRepeated: false,
      },
    });
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("limits initials to 2 characters", () => {
    render(Avatar, {
      props: {
        author: { username: "Alice Bob Charlie", avatarColor: "#ff5733" },
        isRepeated: false,
      },
    });
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("hides avatar when isRepeated is true", () => {
    render(Avatar, {
      props: {
        author: { username: "John Doe", avatarColor: "#ff5733" },
        isRepeated: true,
      },
    });
    expect(screen.queryByText("JD")).not.toBeInTheDocument();
  });

  it("renders fallback when username is empty", () => {
    render(Avatar, {
      props: {
        author: { username: "", avatarColor: "#ff5733" },
        isRepeated: false,
      },
    });
    expect(screen.getByText("I")).toBeInTheDocument();
  });
});
