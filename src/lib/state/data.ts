import type { Garden, GardenData } from "$lib/types/garden";
import type { SectionData } from "$lib/types/section";
import type { UserType } from "$lib/types/user";
import { writable, type Writable } from "svelte/store";

const globalData = writable<{
  userDataState: UserType | null;
  gardenDataState: GardenData | [];
  sectionDataState: SectionData | [];
  activeGardenState: Garden | null;
}>({
  userDataState: null,
  gardenDataState: [],
  sectionDataState: [],
  activeGardenState: null,
});

const selectedSectionId: Writable<string | null> = writable(null);

const isEditMode: Writable<boolean> = writable(false)

export { globalData, selectedSectionId, isEditMode };
