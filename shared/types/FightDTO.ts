export interface FightDTO {
    bossPercentage: number
    lastPhase: number
    killed: boolean
    endTime: number
    id: number
}

export interface PlayerDTO {
    name: string
    id: number
    guid: number
    type: string
}

export interface PlayerDetails {
    tanks: PlayerDTO[]
    dps: PlayerDTO[]
    healers: PlayerDTO[]
}

export interface PlayerDetailsData {
    playerDetails: PlayerDetails
}

export interface PlayerDetailsWrapper {
    data: PlayerDetailsData
}

export interface ReportDTO {
    fights: FightDTO[]
}

export interface ReportsData {
    data: ReportDTO[]
}

export interface ReportDataDTO {
    reports: ReportsData
}

export interface FightDTO {
    reportData: ReportDataDTO
}

export interface PlayerDetailsDTO {
    reportData: {
        reports: {
            data: {
                playerDetails: PlayerDetailsWrapper
            }[]
        }
    }
}
