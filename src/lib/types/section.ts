import type { Garden } from "./garden";

export type IssueType = {
    solved: boolean;
    issueDescription: string;
    criticalLevel: string;
  };
  
export type SectionInfo = {
    _id: string;
    assignedTo: string;
    sectionName: string;
    temperature: string;
    humidityLevel: number;
    soilMoisture: string;
    lastWatered: string;
    issues: IssueType[] | [];
    plants: string[];
    color: string;
    garden: Garden
  };

export type SectionData  = SectionInfo[]