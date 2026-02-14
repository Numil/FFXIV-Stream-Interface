export interface APIResponse<T> {
    data: T
}

export interface NonRaceFight {
    bossPercentage: number
    lastPhase: number
    id: number
    endTime: number
}
