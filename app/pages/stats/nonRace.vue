<script setup lang="ts">
definePageMeta({
    layout: 'stats'
})

const route = useRoute()
const { zoneId, encounterId } = route.query

const { bestPhase, bestPullPercent, pullCount, composition } = useNonRaceFight(
    zoneId as string,
    encounterId as string,
    3000000
)

const data = useState<FightDTO[] | undefined>(
    `nonRaceFight-${zoneId}-${encounterId}`
)

const reversedData = computed(() => {
    const arrayCopy = data.value?.slice()
    return arrayCopy?.reverse()
})

const numberOfPullPerPhase = computed(() => {
    return reversedData.value?.reduce(
        (acc: Record<number, number>, fight: FightDTO) => {
            acc[fight.lastPhase] = (acc[fight.lastPhase] || 0) + 1
            return acc
        },
        {} as Record<number, number>
    )
})

const numberOfPullsSincePB = computed(() => {
    console.log(bestPhase.value, bestPullPercent.value)
    console.log(data.value)
    const bestPullIndex = data.value?.findIndex((fight) => {
        return (
            fight.lastPhase === bestPhase.value &&
            fight.bossPercentage === bestPullPercent.value
        )
    })

    console.log(bestPullIndex)
    return data.value?.slice(bestPullIndex).length
})
</script>

<template>
    <UPageGrid>
        <PullPerPhase :number-of-pull-per-phase="numberOfPullPerPhase" />
        <FightData
            :best-phase="bestPhase"
            :best-pull-percent="bestPullPercent"
            :pull-count="pullCount"
            :number-of-pulls-since-p-b="numberOfPullsSincePB"
        />
        <UCard v-if="composition" variant="soft" class="col-span-3">
            <template #header>
                <h1 class="text-2xl font-bold">Composition</h1>
            </template>
            <PlayerComposition :composition is-stats />
        </UCard>
    </UPageGrid>
</template>
