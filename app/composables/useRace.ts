import type { APIResponse } from '#shared/types/API'
import type {
    Encounter,
    ProgressRaceData,
    ProgressRaceDataGraph,
    Pull
} from '#shared/types/Race'
import { gql } from 'graphql-request'

export default (zoneId?: string, delay: number = 30000) => {
    const authToken = useAuthToken()
    const guildId = useRuntimeConfig().public.guildId

    const currentEncounter = ref<Encounter>()
    const encounterCount = ref<number>(0)
    const currentEncounterIndex = ref<number>(0)
    const lastPull = ref<Pull>()

    const fightIDsPerReports = ref<{ [key: string]: number[] }>({})

    const raceDocument = gql`
        query {
            progressRaceData {
                progressRace(guildID: ${guildId}${
                    zoneId ? `, zoneID: ${zoneId}` : ''
                })
            }
        }
    `

    const fetchRaceData = async () => {
        const raceResponse = await $fetch<APIResponse<ProgressRaceDataGraph>>(
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

        const progressRaceData: ProgressRaceData =
            raceResponse.data.progressRaceData

        const progressRace = progressRaceData.progressRace[0]

        if (progressRace) {
            currentEncounter.value = progressRace.encounters.find(
                (encounter) => encounter.id === progressRace.currentEncounterId
            )

            encounterCount.value = progressRace.encounters.length
            currentEncounterIndex.value = progressRace.encounters.findIndex(
                (encounter) => encounter.id === progressRace.currentEncounterId
            )

            if (currentEncounter.value) {
                getFightIDsPerReports(currentEncounter.value?.perPull)
            }

            if (currentEncounter.value) {
                lastPull.value =
                    currentEncounter.value.perPull[
                        currentEncounter.value.perPull.length - 1
                    ]
            }
        }
    }

    const getFightIDsPerReports = (pulls: Pull[]) => {
        pulls.forEach((element) => {
            if (!fightIDsPerReports.value[element.reportCode]) {
                fightIDsPerReports.value[element.reportCode] = [element.fightId]
            } else if (
                !fightIDsPerReports.value[element.reportCode].includes(
                    element.fightId
                )
            ) {
                fightIDsPerReports.value[element.reportCode].push(
                    element.fightId
                )
            }
        })
    }

    const interval = ref<NodeJS.Timeout | undefined>()

    onMounted(() => {
        fetchRaceData()
        interval.value = setInterval(async () => {
            await fetchRaceData()
        }, delay)
    })

    onUnmounted(() => {
        if (interval) {
            clearInterval(interval.value)
        }
    })

    return {
        currentEncounter,
        currentEncounterIndex,
        encounterCount,
        fightIDsPerReports,
        lastPull
    }
}
