<script setup lang="ts">
definePageMeta({
    layout: 'stats'
})

const route = useRoute()
const { zoneId, encounterId } = route.query

const {
    bestPhase,
    bestPullPercent,
    pullCount,
    composition,
    data,
    numberOfPullsInBetweenEachPB
} = useNonRaceFight(zoneId as string, encounterId as string, 0)

const numberOfPullPerPhase = computed(() => {
    return data.value?.reduce(
        (acc: Record<number, number>, fight: FightDTO) => {
            acc[fight.lastPhase] = (acc[fight.lastPhase] || 0) + 1
            return acc
        },
        {} as Record<number, number>
    )
})

const numberOfPullsSincePB = computed(() => {
    const bestPullIndex = data.value?.findIndex((fight) => {
        return (
            fight.lastPhase === bestPhase.value &&
            fight.bossPercentage === bestPullPercent.value
        )
    })

    return data.value?.slice(bestPullIndex).length
})

const maxPhase = computed(() => {
    return route.query.phases
        ? Number(route.query.phases)
        : Math.max(...(data.value?.map((fight) => fight.lastPhase) || []))
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
            :loading="!bestPhase"
        />
        <PBProgression
            :number-of-pulls-in-between-each-p-b="numberOfPullsInBetweenEachPB"
            :pull-count="pullCount"
        />
        <UCard variant="soft" class="col-span-3">
            <template #header>
                <h1 class="text-2xl font-bold">Composition</h1>
            </template>

            <div
                v-if="!composition"
                class="animate-pulse rounded-xl col-span-3 bg-accented h-[180px]"
            />
            <PlayerComposition v-else :composition is-stats />
        </UCard>
        <PullGraph
            :data="
                data?.map((fight, index) => ({
                    phase: fight.lastPhase,
                    count: index + 1,
                    pullPercent:
                        (fight.bossPercentage + (fight.lastPhase - 1) * 100) /
                            100 +
                        1
                })) || []
            "
            :max-phase="maxPhase"
            class="col-span-3"
        />
    </UPageGrid>
</template>
