export interface FightIDsWithReport {
    [key: string]: number[]
}

export interface ReportDataObject {
    reportData: ReportData
}

export interface ReportData {
    report: Report
}

export interface Report {
    table: Table
}

export interface Table {
    data: TableData
}

export interface TableData {
    entries: Entry[]
}

export interface Entry {
    name: string
    id: number
    guid: number
    type: string
    icon: string
    timestamp: number
    fight: number
    damage: Damage
    healing: Healing
    deathWindow: number
    overkill: number
    events: AbilityEvent[]
    killingBlow: KillingBlow
}

export interface Damage {
    total: number
    totalReduced: number
    activeTime: number
    activeTimeReduced: number
    abilities: DamageAbility[]
    damageAbilities: DamageAbility[]
    sources: DamageSource[]
}

export interface DamageAbility {
    name: string
    total: number
    totalReduced?: number
    type: number
}

export interface DamageSource {
    name: string
    total: number
    totalReduced?: number
    type: string
}

export interface Healing {
    total: number
    totalReduced: number
    activeTime: number
    activeTimeReduced: number
    abilities: HealingAbility[]
    damageAbilities: HealingAbility[]
    sources: HealingSource[]
    totalRDPS: number
    totalRDPSTaken: number
    totalRDPSGiven: number
    totalADPS: number
    totalNDPS: number
    totalCDPS: number
    given: any[]
    taken: any[]
}

export interface HealingAbility {
    name: string
    total: number
    totalReduced?: number // Optional, since not all abilities have this
    type: number
}

export interface HealingSource {
    name: string
    total: number
    totalReduced?: number // Optional, since not all sources have this
    type: string
}

export interface AbilityEvent {
    timestamp: number
    type: string
    sourceID: number
    sourceInstance: number
    sourceIsFriendly: boolean
    targetID: number
    targetIsFriendly: boolean
    ability: Ability
    fight: number
    hitType: number
    amount: number
    unmitigatedAmount: number
    overkill?: number // Optional
    absorbed?: number // Optional
    packetID: number
    multiplier: number
}

export interface Ability {
    name: string
    guid: number
    type: number
    abilityIcon: string
}

export interface KillingBlow {
    name: string
    guid: number
    type: number
    abilityIcon: string
}
