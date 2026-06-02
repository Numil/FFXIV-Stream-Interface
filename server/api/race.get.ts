import { gql } from 'graphql-request'

export default defineCachedEventHandler(
    async (event) => {
        const { zoneId } = getQuery(event)
        const { guildId } = useRuntimeConfig()

        const raceDocument = gql`
        query {
            progressRaceData {
                progressRace(guildID: ${guildId}${
                    zoneId ? `, zoneID: ${zoneId}` : ''
                })
            }
        }
    `

        const raceResponse =
            await fflogsQuery<ProgressRaceDataGraph>(raceDocument)

        const progressRaceData = raceResponse.data.progressRaceData
        const progressRace = progressRaceData.progressRace[0]

        if (!progressRace) {
            return null
        }

        const currentEncounter = progressRace.encounters.find(
            (encounter) => encounter.id === progressRace.currentEncounterId
        )

        const encounterCount = progressRace.encounters.length
        const currentEncounterIndex = progressRace.encounters.findIndex(
            (encounter) => encounter.id === progressRace.currentEncounterId
        )

        const fightIDsPerReports: Record<string, number[]> = {}
        if (currentEncounter) {
            for (const pull of currentEncounter.perPull) {
                if (!fightIDsPerReports[pull.reportCode]) {
                    fightIDsPerReports[pull.reportCode] = [pull.fightId]
                } else if (
                    !fightIDsPerReports[pull.reportCode]!.includes(pull.fightId)
                ) {
                    fightIDsPerReports[pull.reportCode]!.push(pull.fightId)
                }
            }
        }

        const lastPull = currentEncounter
            ? currentEncounter.perPull[currentEncounter.perPull.length - 1]
            : undefined

        const bestPullPercent = currentEncounter?.bestPercentForDisplay
        const bestPhase = (currentEncounter?.bestPhaseIndex ?? 0) + 1
        const isCleared = !!currentEncounter?.isKilled
        const pullCount = currentEncounter?.pullCount ?? 0

        const composition = currentEncounter?.composition?.roles
            ? formatForPlayerDetails(currentEncounter.composition.roles)
            : undefined

        return {
            currentEncounter,
            encounterCount,
            currentEncounterIndex,
            lastPull,
            fightIDsPerReports,
            bestPullPercent,
            bestPhase,
            isCleared,
            pullCount,
            composition
        }
    },
    {
        maxAge: 30,
        getKey: (event) => {
            const { zoneId } = getQuery(event)
            return `race:${zoneId || 'default'}`
        }
    }
)
