interface FightIDsWithReport {
    [key: string]: number[]
}

interface ReportDataObject {
    reportData: ReportData
}

interface ReportData {
    report: Report
}

interface Report {
    table: Table
}

interface Table {
    data: TableData
}

interface TableData {
    entries: Entry[]
}

interface Entry {
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

interface Damage {
    total: number
    totalReduced: number
    activeTime: number
    activeTimeReduced: number
    abilities: DamageAbility[]
    damageAbilities: DamageAbility[]
    sources: DamageSource[]
}

interface DamageAbility {
    name: string
    total: number
    totalReduced?: number
    type: number
}

interface DamageSource {
    name: string
    total: number
    totalReduced?: number
    type: string
}

interface Healing {
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

interface HealingAbility {
    name: string
    total: number
    totalReduced?: number // Optional, since not all abilities have this
    type: number
}

interface HealingSource {
    name: string
    total: number
    totalReduced?: number // Optional, since not all sources have this
    type: string
}

interface AbilityEvent {
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

interface Ability {
    name: string
    guid: number
    type: number
    abilityIcon: string
}

interface KillingBlow {
    name: string
    guid: number
    type: number
    abilityIcon: string
}
