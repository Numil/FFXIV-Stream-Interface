import { gql } from 'graphql-request'

export default (delay: number = 10000) => {
    const authToken = useAuthToken()

    const currentEncounter = ref<Encounter>()
    const lastPull = ref<Pull>()

    const fightIDsPerReports = ref<{ [key: string]: number[] }>({})

    const raceDocument = gql`
        query {
            progressRaceData {
                progressRace(guildID: 126166)
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
        fightIDsPerReports,
        lastPull
    }
}
