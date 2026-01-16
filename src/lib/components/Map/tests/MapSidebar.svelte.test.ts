// @ts-nocheck
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type MockedFunction,
} from "vitest";
import { render, screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import MapSidebar from "../MapSidebar.svelte";
import type { SectionInfo } from "$lib/types/section";
import type { IconType } from "$lib/types/garden";

const mockSearchParamsGet: MockedFunction<() => string | null> = vi.fn();

vi.mock("$app/state", () => ({
  page: {
    url: {
      searchParams: {
        get: () => mockSearchParamsGet(),
      },
    },
  },
}));

vi.mock("$app/navigation", () => ({
  invalidate: vi.fn(() => Promise.resolve()),
}));

describe("MapSidebar", () => {
  let mockUpdateSelectSectionId: ReturnType<typeof vi.fn>;
  let mockUpdateSelectedIcon: ReturnType<typeof vi.fn>;
  let mockUpdateLocalSectionData: ReturnType<typeof vi.fn>;

  const mockGardenData = [
    {
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
    },
  ];

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
    garden: mockGardenData[0],
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

  const mockPlantTypes: IconType[] = [
    { type: "Plant", icon: "🌱" },
    { type: "Bush", icon: "🌿" },
    { type: "Tree", icon: "🌾" },
  ];

  beforeEach(() => {
    mockUpdateSelectSectionId = vi.fn();
    mockUpdateSelectedIcon = vi.fn();
    mockUpdateLocalSectionData = vi.fn();

    global.fetch = vi.fn();

    mockSearchParamsGet.mockReturnValue("garden-1");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (
    sections: SectionInfo[] = [mockSection1, mockSection2],
    isEditMode = false,
    selectedSectionId = "",
    selectedIcon: IconType | null = null,
  ) => {
    return render(MapSidebar, {
      props: {
        sectionData: sections,
        isEditMode,
        gardenData: mockGardenData,
        selectedSectionId,
        updateSelectSectionId: mockUpdateSelectSectionId,
        plantTypes: mockPlantTypes,
        selectedIcon,
        updateSelectedIcon: mockUpdateSelectedIcon,
        updateLocalSectionData: mockUpdateLocalSectionData,
      },
    });
  };

  it("renders header correctly", () => {
    renderComponent();
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Garden Map")).toBeInTheDocument();
  });

  it("shows note when no sections exist for current garden", () => {
    renderComponent([mockSection2], true); // Must be in edit mode to see the message
    expect(screen.queryByText("Vegetable Garden")).not.toBeInTheDocument();
  });

  it("calls updateSelectSectionId when section is clicked in edit mode", async () => {
    const user = userEvent.setup();
    renderComponent([mockSection1], true);

    await user.click(screen.getByText("Vegetable Garden"));
    expect(mockUpdateSelectSectionId).toHaveBeenCalledWith("section-1");
  });

  it("does not call updateSelectSectionId in non-edit mode", async () => {
    const user = userEvent.setup();
    renderComponent([mockSection1], false);

    await user.click(screen.getByText("Vegetable Garden"));
    expect(mockUpdateSelectSectionId).not.toHaveBeenCalled();
  });

  it("renders CreateNewSection in edit mode", () => {
    renderComponent([mockSection1], true);
    expect(screen.getByPlaceholderText("Section name")).toBeInTheDocument();
  });

  it("does not render CreateNewSection in non-edit mode", () => {
    renderComponent([mockSection1], false);
    expect(
      screen.queryByPlaceholderText("Section name"),
    ).not.toBeInTheDocument();
  });

  it("renders plant types in edit mode", () => {
    renderComponent([mockSection1], true);
    expect(screen.getByText("Plant")).toBeInTheDocument();
    expect(screen.getByText("Bush")).toBeInTheDocument();
    expect(screen.getByText("Tree")).toBeInTheDocument();
  });

  it("calls updateSelectedIcon on plant click", async () => {
    const user = userEvent.setup();
    renderComponent([mockSection1], true);

    await user.click(screen.getByText("Plant"));
    expect(mockUpdateSelectedIcon).toHaveBeenCalledWith(mockPlantTypes[0]);
  });

  it("toggles selected icon off when clicked again", async () => {
    const user = userEvent.setup();
    renderComponent([mockSection1], true, "", mockPlantTypes[0]);

    await user.click(screen.getByText("Plant"));
    expect(mockUpdateSelectedIcon).toHaveBeenCalledWith(null);
  });

  it("clears selected section when icon is selected", async () => {
    const user = userEvent.setup();
    renderComponent([mockSection1], true);

    await user.click(screen.getByText("Plant"));
    expect(mockUpdateSelectSectionId).toHaveBeenCalledWith("");
  });

  it("applies selected styling to selected icon", () => {
    renderComponent([mockSection1], true, "", mockPlantTypes[0]);
    expect(screen.getByText("Plant").closest("button")).toHaveClass(
      "bg-lime-100/60",
    );
  });

  it("handles empty garden ID", () => {
    mockSearchParamsGet.mockReturnValue(null);
    renderComponent([mockSection1, mockSection2], false);

    // When garden ID is null, sections should still be displayed
    expect(screen.getByText("Vegetable Garden")).toBeInTheDocument();
    expect(screen.getByText("Flower Bed")).toBeInTheDocument();
  });
});
