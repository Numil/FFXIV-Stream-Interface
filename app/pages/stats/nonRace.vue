<script setup lang="ts">
import type { Fight } from '~~/shared/types/FightDTO'

definePageMeta({
    layout: 'stats'
})

const route = useRoute()
const { zoneId, encounterId } = route.query

const { bestPhase, bestPullPercent, pullCount } = useNonRaceFight(
    zoneId as string,
    encounterId as string,
    3000000
)

const data = useState<Fight[] | undefined>(
    `nonRaceFight-${zoneId}-${encounterId}`
)

const reversedData = computed(() => {
    return data.value?.reverse()
})

const numberOfPullPerPhase = computed(() => {
    return reversedData.value?.reduce(
        (acc: Record<number, number>, fight: Fight) => {
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
        <PullPerPhase
            v-if="data && numberOfPullPerPhase"
            :numberOfPullPerPhase="numberOfPullPerPhase"
        />
        <UCard variant="soft">
            <template #header>
                <h1 class="text-2xl font-bold">Best Pull</h1>
            </template>
            <div class="text-sm">Phase: {{ bestPhase }}</div>
            <div class="text-2xl font-semibold">{{ bestPullPercent }} %</div>
        </UCard>
        <UCard variant="soft">
            <template #header>
                <h1 class="text-2xl font-bold">Pull count</h1>
            </template>
            <div class="text-sm font-light">Total</div>
            <div class="text-2xl font-semibold">{{ pullCount }}</div>
        </UCard>
        <UCard variant="soft">
            <template #header>
                <h1 class="text-2xl font-bold">Pulls since best pull</h1>
            </template>
            <div class="text-sm font-light">Total</div>
            <div class="text-2xl font-semibold">
                {{ numberOfPullsSincePB }}
            </div>
        </UCard>
    </UPageGrid>
</template>
