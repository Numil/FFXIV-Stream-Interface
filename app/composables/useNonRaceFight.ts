import type { APIResponse } from '#shared/types/API'
import type {
    FightDTO,
    PlayerDetailsDTO
} from '#shared/types/FightDTO'
import { gql } from 'graphql-request'

export default (zoneId: string, encounterId: string, delay: number = 30000) => {
    const authToken = useAuthToken()
    const guildId = useRuntimeConfig().public.guildId
    const interval = ref<ReturnType<typeof setInterval> | undefined>()

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

    const lastFight = computed(() => {
        return data.value?.[data.value.length - 1]
    })

    const sortedFights = computed(() => {
        if (!data.value) return []

        return [...data.value]?.sort((a, b) => a.endTime - b.endTime)
    })

    const bestPullFight = computed(() => {
        return [...sortedFights.value].sort((a, b) => a.bossPercentage - b.bossPercentage).sort((a, b) => b.lastPhase - a.lastPhase)[0]
    })

    const bestPhase = computed(() => {
        return bestPullFight.value?.lastPhase
    })

    const bestPullPercent = computed(() => {
        return bestPullFight.value?.bossPercentage
    })

    const pullCount = computed(() => {
        return sortedFights.value.length
    })

    const isCleared = computed(() => {
        return sortedFights.value.some(fight => fight.killed)
    })

    const { refresh, data } = useAsyncData(async () => {
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
        ).reverse()

        return dedupedFights
    })

    const { data: composition } = useAsyncData('composition', async () => {
        if (!lastFight.value || !lastFight.value.id || !lastFight.value.endTime) return null

        const compositionResponse = await $fetch<APIResponse<PlayerDetailsDTO>>(
            `/fflogs/api/v2/client`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken.value}`
                },
                body: JSON.stringify({
                    query: getComposition(lastFight.value.id, lastFight.value.endTime)
                })
            }
        )

        return compositionResponse.data.reportData.reports.data.find(
            d => !Array.isArray(d.playerDetails.data.playerDetails)
        )?.playerDetails.data.playerDetails || null
    }, {
        watch: [() => lastFight.value?.id]
    })

    onMounted(() => {
        if (delay !== 0) {
            interval.value = setInterval(async () => {
                await refresh()
            }, delay)
        }
    })

    onUnmounted(() => {
        if (interval && delay !== 0) {
            clearInterval(interval.value)
        }
    })

    return {
        bestPullPercent,
        bestPhase,
        isCleared,
        pullCount,
        composition,
        data
    }
}
