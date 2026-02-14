export default (zoneId: string, encounterId: string, delay: number = 30000) => {
    const data = ref<NonRaceFight[]>()
    const bestPullPercent = ref<number>()
    const bestPhase = ref<number>()
    const isCleared = ref<boolean>(false)
    const pullCount = ref<number>(0)
    const composition = ref<PlayerDetails | null>(null)
    const numberOfPullsInBetweenEachPB = ref<PBs[]>([])

    const encounterCount = ref(1)
    const currentEncounterIndex = ref(0)

    const fetchData = async () => {
        const response = await $fetch('/api/non-race-fight', {
            params: { zoneId, encounterId }
        })

        data.value = response.data
        bestPullPercent.value = response.bestPullPercent
        bestPhase.value = response.bestPhase
        isCleared.value = response.isCleared
        pullCount.value = response.pullCount
        composition.value = response.composition
        numberOfPullsInBetweenEachPB.value =
            response.numberOfPullsInBetweenEachPB
    }

    let interval: ReturnType<typeof setInterval> | undefined = undefined

    onMounted(() => {
        fetchData()
        if (delay !== 0) {
            interval = setInterval(async () => {
                await fetchData()
            }, delay)
        }
    })

    onUnmounted(() => {
        if (interval && delay !== 0) {
            clearInterval(interval)
        }
    })

    return {
        bestPullPercent,
        bestPhase,
        isCleared,
        pullCount,
        composition,
        encounterCount,
        currentEncounterIndex,
        data,
        numberOfPullsInBetweenEachPB
    }
}
