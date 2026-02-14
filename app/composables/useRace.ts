export default (zoneId?: string, delay: number = 30000) => {
    const currentEncounter = ref<Encounter>()
    const encounterCount = ref<number>(0)
    const currentEncounterIndex = ref<number>(0)
    const lastPull = ref<Pull>()
    const fightIDsPerReports = ref<FightIDsWithReport>({})
    const bestPullPercent = ref<string>()
    const bestPhase = ref<number>(0)
    const isCleared = ref<boolean>(false)
    const pullCount = ref<number>(0)
    const composition = ref<PlayerDetails>()

    const fetchRaceData = async () => {
        const response = await $fetch('/api/race', {
            params: { zoneId }
        })

        if (!response) return

        currentEncounter.value = response.currentEncounter as
            | Encounter
            | undefined
        encounterCount.value = response.encounterCount
        currentEncounterIndex.value = response.currentEncounterIndex
        lastPull.value = response.lastPull as Pull | undefined
        fightIDsPerReports.value = response.fightIDsPerReports
        bestPullPercent.value = response.bestPullPercent
        bestPhase.value = response.bestPhase
        isCleared.value = response.isCleared
        pullCount.value = response.pullCount
        composition.value = response.composition as PlayerDetails | undefined
    }

    let interval: ReturnType<typeof setInterval> | undefined = undefined

    onMounted(() => {
        fetchRaceData()
        interval = setInterval(async () => {
            await fetchRaceData()
        }, delay)
    })

    onUnmounted(() => {
        if (interval) {
            clearInterval(interval)
        }
    })

    return {
        currentEncounter,
        currentEncounterIndex,
        encounterCount,
        fightIDsPerReports,
        lastPull,
        bestPullPercent,
        bestPhase,
        isCleared,
        pullCount,
        composition
    }
}
