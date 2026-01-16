// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import SidebarSections from "../SidebarSections.svelte";
import type { SectionInfo } from "$lib/types/section";

describe("SidebarSections", () => {
  let mockHandleSectionClick: ReturnType<typeof vi.fn>;
  let mockHandleDeleteSection: ReturnType<typeof vi.fn>;

  const mockGarden1 = {
    _id: "garden-1",
    name: "Test Garden",
    createdAt: "2024-01-01",
    description: "Test",
    grid: [],
    joinCode: "ABC123",
    location: { address: "Test Address" },
    maxMembers: 10 as const,
    members: [],
    owner: { email: "test@test.com", _id: "owner-1" },
    __v: 3 as const,
  };

  const mockSection1: SectionInfo = {
    _id: "section-1",
    sectionName: "Vegetable Garden",
    plants: ["Tomato", "Lettuce"],
    color: "bg-green-300",
    assignedTo: "user-1",
    temperature: "20",
    humidityLevel: 60,
    soilMoisture: "moist",
    lastWatered: "2024-01-01",
    issues: [],
    garden: mockGarden1,
  };

  const mockSection2: SectionInfo = {
    _id: "section-2",
    sectionName: "Flower Bed",
    plants: ["Rose", "Tulip"],
    color: "bg-rose-400",
    assignedTo: "user-1",
    temperature: "22",
    humidityLevel: 50,
    soilMoisture: "dry",
    lastWatered: "2024-01-02",
    issues: [],
    garden: {
      _id: "garden-2",
      name: "Other Garden",
      createdAt: "2024-01-01",
      description: "Test",
      grid: [],
      joinCode: "XYZ789",
      location: { address: "Other Address" },
      maxMembers: 10 as const,
      members: [],
      owner: { email: "test@test.com", _id: "owner-1" },
      __v: 3 as const,
    },
  };

  beforeEach(() => {
    mockHandleSectionClick = vi.fn();
    mockHandleDeleteSection = vi.fn();
  });

  const renderComponent = (
    sections: SectionInfo[] = [mockSection1, mockSection2],
    selectedId = "",
  ) => {
    return render(SidebarSections, {
      props: {
        sectionData: sections,
        handleSectionClick: mockHandleSectionClick,
        handleDeleteSection: mockHandleDeleteSection,
        selectedSectionId: selectedId,
      },
    });
  };

  it("renders all sections", () => {
    renderComponent();

    expect(screen.getByText("Vegetable Garden")).toBeInTheDocument();
    expect(screen.getByText("Flower Bed")).toBeInTheDocument();
  });

  it("renders section names correctly", () => {
    renderComponent();

    expect(screen.getByText("Vegetable Garden")).toBeInTheDocument();
    expect(screen.getByText("Flower Bed")).toBeInTheDocument();
  });

  it("renders delete button for each section", () => {
    renderComponent();

    const deleteButtons = screen.getAllByLabelText("Delete section");
    expect(deleteButtons.length).toBe(2);
  });

  it("calls handleSectionClick when section is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();

    const sectionElement = screen
      .getByText("Vegetable Garden")
      .closest('[role="button"]');
    if (sectionElement) {
      await user.click(sectionElement);
    }

    expect(mockHandleSectionClick).toHaveBeenCalledWith(mockSection1);
  });

  it("calls handleDeleteSection when delete button is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();

    const deleteButtons = screen.getAllByLabelText("Delete section");
    await user.click(deleteButtons[0]);

    expect(mockHandleDeleteSection).toHaveBeenCalledWith("section-1");
  });

  it("applies selected styling to selected section", () => {
    renderComponent([mockSection1, mockSection2], "section-1");

    const sectionElement = screen
      .getByText("Vegetable Garden")
      .closest('[role="button"]');
    expect(sectionElement).toHaveClass("bg-lime-100/60");
  });

  it("does not apply selected styling to unselected sections", () => {
    renderComponent([mockSection1, mockSection2], "section-1");

    const sectionElement = screen
      .getByText("Flower Bed")
      .closest('[role="button"]');
    expect(sectionElement).not.toHaveClass("bg-lime-100/60");
  });

  it("renders empty state when no sections provided", () => {
    renderComponent([]);

    expect(screen.queryByText("Vegetable Garden")).not.toBeInTheDocument();
    expect(screen.queryByText("Flower Bed")).not.toBeInTheDocument();
  });

  it("applies section color class to section element", () => {
    renderComponent();

    const section1Container = screen
      .getByText("Vegetable Garden")
      .closest('[role="button"]');
    const section1ColorDot = section1Container?.querySelector(".bg-green-300");
    expect(section1ColorDot).toBeInTheDocument();

    const section2Container = screen
      .getByText("Flower Bed")
      .closest('[role="button"]');
    const section2ColorDot = section2Container?.querySelector(".bg-rose-400");
    expect(section2ColorDot).toBeInTheDocument();
  });

  it("handles multiple section clicks correctly", async () => {
    const user = userEvent.setup();
    renderComponent();

    const section1Element = screen
      .getByText("Vegetable Garden")
      .closest('[role="button"]');
    const section2Element = screen
      .getByText("Flower Bed")
      .closest('[role="button"]');

    if (section1Element) {
      await user.click(section1Element);
    }
    if (section2Element) {
      await user.click(section2Element);
    }

    expect(mockHandleSectionClick).toHaveBeenCalledTimes(2);
    expect(mockHandleSectionClick).toHaveBeenNthCalledWith(1, mockSection1);
    expect(mockHandleSectionClick).toHaveBeenNthCalledWith(2, mockSection2);
  });
});
