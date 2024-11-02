import { gql } from 'graphql-request'

export default () => {
    const authToken = useAuthToken()

    const currentEncounter = ref<Encounter>()
    const lastPull = ref<Pull>()

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
                lastPull.value =
                    currentEncounter.value.perPull[
                        currentEncounter.value.perPull.length - 1
                    ]
            }
        }
    }

    let interval = ref<NodeJS.Timeout | undefined>()

    onMounted(() => {
        fetchRaceData()
        interval.value = setInterval(async () => {
            await fetchRaceData()
        }, 10000)
    })

    onUnmounted(() => {
        if (interval) {
            clearInterval(interval.value)
        }
    })

    return {
        currentEncounter,
        lastPull
    }
}
