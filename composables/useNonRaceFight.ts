import { gql } from 'graphql-request'
import type { APIResponse } from '~/interfaces/API'
import type {
    FightDTO,
    PlayerDetails,
    PlayerDetailsDTO
} from '~/interfaces/FightDTO'

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

    const getComposition = (fightID: number) => gql`
        query {
            reportData {
                reports(guildID: ${guildId}, zoneID: ${zoneId}) {
                    data {
                        playerDetails(fightIDs: ${fightID}, encounterID: ${encounterId})
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
                    Authorization: `Bearer ${authToken.value}`
                },
                body: JSON.stringify({ query: raceDocument })
            }
        )

        const mergedFights = nonRaceFightResponse.data.reportData.reports.data
            .map((report) => report.fights)
            .flat()

        // dedupe end fight times
        const dedupedFights = mergedFights.filter(
            (fight, index, self) =>
                index === self.findIndex((t) => t.endTime === fight.endTime)
        )

        const compositionResponse = await $fetch<APIResponse<PlayerDetailsDTO>>(
            `/fflogs/api/v2/client`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken.value}`
                },
                body: JSON.stringify({
                    query: getComposition(
                        dedupedFights[dedupedFights.length - 1].id!
                    )
                })
            }
        )

        const sortedFights = dedupedFights
            .sort((a, b) => b.bossPercentage - a.bossPercentage)
            .sort((a, b) => b.lastPhase - a.lastPhase)

        bestPullPercent.value = sortedFights[0].bossPercentage
        bestPhase.value = sortedFights[0].lastPhase
        pullCount.value = sortedFights.length

        isCleared.value = sortedFights.some((fight) => fight.killed)

        composition.value =
            compositionResponse.data.reportData.reports.data[0].playerDetails.data.playerDetails
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
