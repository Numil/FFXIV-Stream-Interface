export interface Fight {
    bossPercentage: number
    lastPhase: number
    killed: boolean
    id: number
}

export interface Player {
    name: string
    id: number
    guid: number
    type: string
}

export interface PlayerDetails {
    tanks: Player[]
    dps: Player[]
    healers: Player[]
}

export interface PlayerDetailsData {
    playerDetails: PlayerDetails
}

export interface PlayerDetailsWrapper {
    data: PlayerDetailsData
}

export interface Report {
    fights: Fight[]
}

export interface ReportsData {
    data: Report[]
}

export interface ReportData {
    reports: ReportsData
}

export interface FightDTO {
    reportData: ReportData
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
