export interface ProgressRaceDataGraph {
    progressRaceData: ProgressRaceData
}

export interface ProgressRaceData {
    progressRace: ProgressRace[]
}

export interface ProgressRace {
    id: number
    name: string
    faction: number
    logoImageUrl: string
    logoImageIsCustom: boolean
    logoImageFallbackUrl: string
    streamChannel: string | null
    rank: string | null
    killedCount: number
    nameCssClass: string
    rankCssClass: string
    encounters: Encounter[]
    currentEncounterId: number
    coach: string | null
    guildIsStreaming: boolean
    lastKillTime: number
    bestPercentOfNonKilledEncounters: string | null
    reportTimestampsUsedHash: string
    isFullUpdate: boolean
    region: Region
}

export interface Encounter {
    id: number
    name: string
    shortName: string
    backgroundImageUrl: string
    backgroundImageFallbackUrl: string
    iconImageUrl: string
    transparentImageUrl: string
    isKilled: boolean
    killedAtTimestamp: number
    youtubeEmbedUrl: string | null
    showStats: boolean
    bestPercent: number
    bestPercentForDisplay: string
    pullCount: number
    composition: Composition
    perPull: Pull[]
    bestPhaseIndex: number
    showAnalyzeAllPullsButton: boolean
    shouldShowFightSummaryCharts: boolean
}

export interface Composition {
    roles: Role[]
    supportsCombatantInfo: boolean
    baseUrl: string
    region: Region
    labels: string | null
    setGearThresholds: string | null
    showTalentsAsNumbers: boolean
    significantItemLevelThreshold: string | null
    preloadedTalentBlueprints: string | null
}

export interface Role {
    name: string
    maxNumberOfColumns: number
    players: Player[]
}

export interface Player {
    guid: number
    name: string
    server: string
    type: string
    fullType: string
    itemLevel: number | null
    streamChannel: string | null
    streamViewers: number | null
    talents: any[]
    singleCustomPower: any | null
    singleSecondaryCustomPower: any | null
    customPowers: any[]
    secondaryCustomPowers: any[]
    gearItems: any[]
    setGearItems: any[]
    effectGearItems: any[]
    talentTree: any | null
}

export interface Pull {
    reportCode: string
    fightId: number
    reportIsPrivate: boolean
    startTime: number
    endTime: number
    duration: number
    fightPercentage: number
    bestPercentForDisplay: string
    lastPhase: any | null
}

export interface Region {
    id: number
    name: string
    shortName: string
}
