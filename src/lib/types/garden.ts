export type IconType = {type: string, icon: string}
export type GridBoxType = { index: number; section: string | null, plant: string };
export type Garden = {
    createdAt: string,
    description: string,
    grid: GridBoxType[],
    joinCode: string
    location: { address: string},
    maxMembers: 10
    members: {email: string, _id: string}[],
    name: string
    owner: {email: string, _id: string},
    __v: 3
    _id: string
}

export type GardenData = Garden[]
