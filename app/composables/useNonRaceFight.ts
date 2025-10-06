import type { APIResponse } from '#shared/types/API'
import type {
    FightDTO,
    PlayerDetails,
    PlayerDetailsDTO
} from '#shared/types/FightDTO'
import { gql } from 'graphql-request'

export default (zoneId: string, encounterId: string, delay: number) => {
    const authToken = useAuthToken()
    const guildId = useRuntimeConfig().public.guildId
    const bestPullPercent = ref(0)
    const bestPhase = ref(0)
    const isCleared = ref(false)
    const interval = ref<ReturnType<typeof setInterval> | undefined>()
    const pullCount = ref(0)

    const composition = ref<PlayerDetails | null>(null)

    const raceDocument = gql`
        query {
            reportData {
                reports(guildID: ${guildId}, zoneID: ${zoneId}) {
                    data {
                        fights(encounterID: ${encounterId}) {
                            bossPercentage
                            lastPhase
                            id
                            endTime
                        }
                    }
                }
            }
        }
    `

    const getComposition = (fightID: number, endTime: number) => gql`
        query {
            reportData {
                reports(guildID: ${guildId}, zoneID: ${zoneId}) {
                    data {
                        playerDetails(fightIDs: ${fightID}, encounterID: ${encounterId}, endTime: ${endTime})
                    }
                }
            }
        }
    `

    const fetchNonRaceFight = async () => {
        const nonRaceFightResponse = await $fetch<APIResponse<FightDTO>>(
            `/fflogs/api/v2/client`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken.value}`
                },
                body: JSON.stringify({ query: raceDocument })
            }
        )

        const mergedFights = nonRaceFightResponse.data.reportData.reports.data
            .map(report => report.fights)
            .flat()

        // dedupe end fight times
        const dedupedFights = mergedFights.filter(
            (fight, index, self) =>
                index === self.findIndex(t => t.endTime === fight.endTime)
        )

        useState(`nonRaceFight-${zoneId}-${encounterId}`, () => JSON.parse(JSON.stringify(dedupedFights)))

        const lastFight = dedupedFights[dedupedFights.length - 1]!
        const compositionResponse = await $fetch<APIResponse<PlayerDetailsDTO>>(
            `/fflogs/api/v2/client`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken.value}`
                },
                body: JSON.stringify({
                    query: getComposition(lastFight.id!, lastFight.endTime!)
                })
            }
        )

        const sortedFights = dedupedFights
            .sort((a, b) => a.bossPercentage - b.bossPercentage)
            .sort((a, b) => b.lastPhase - a.lastPhase)

        if (sortedFights.length === 0) return

        bestPullPercent.value = sortedFights[0]!.bossPercentage
        bestPhase.value = sortedFights[0]!.lastPhase
        pullCount.value = sortedFights.length

        isCleared.value = sortedFights.some(fight => fight.killed)

        composition.value
            = compositionResponse.data.reportData.reports.data.find(
                d => !Array.isArray(d.playerDetails.data.playerDetails)
            )?.playerDetails.data.playerDetails || null
    }

    onMounted(() => {
        fetchNonRaceFight()
        interval.value = setInterval(async () => {
            await fetchNonRaceFight()
        }, delay)
    })

    onUnmounted(() => {
        if (interval) {
            clearInterval(interval.value)
        }
    })

    return {
        bestPullPercent,
        bestPhase,
        isCleared,
        pullCount,
        composition
    }
}
