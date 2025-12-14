import type { SectionData, SectionInfo } from "$lib/types/section";

export const handleReturnGridClasses = function (
  gridSectionId: string | null,
  sectionData: SectionData
) {
  // check if grid serction has issues
  if (!gridSectionId) return;
  let concatClasses = "";
  const section = sectionData?.find((s: SectionInfo) => s._id === gridSectionId);
  if (!section) return "";
  if (section.issues && section.issues.length > 0) {
    concatClasses = "bg-rose-800/65";
  }
  concatClasses += ` ${section.color}`;
  return concatClasses;
};
