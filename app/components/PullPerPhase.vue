<script setup lang="ts">
const { numberOfPullPerPhase = undefined } = defineProps<{
    numberOfPullPerPhase?: Record<number, number>
}>()

const data = computed(() => {
    if (!numberOfPullPerPhase) return undefined
    return Object.keys(numberOfPullPerPhase).map((phase) => {
        return {
            phase: phase,
            numberOfPull: numberOfPullPerPhase[Number(phase)]
        }
    })
})

const chartCategories = computed(() => {
    return {
        numberOfPull: {
            name: 'Number of Pull'
        }
    }
})

const yFormatter = (index: number) => {
    return `Phase ${index + 1}`
}
</script>

<template>
    <UCard
        class="col-span-3"
        variant="soft"
    >
        <template #header>
            <h1 class="text-2xl font-bold">
                Pulls per phase
            </h1>
        </template>

        <ClientOnly>
            <BarChart
                v-if="data"
                :orientation="Orientation.Horizontal"
                :data="data"
                :height="250"
                :categories="chartCategories"
                :y-formatter="yFormatter"
                :y-axis="['numberOfPull']"
            />

            <UCard
                v-else
                class="w-full animate-pulse bg-accented h-[290px]"
            />
        </ClientOnly>
    </UCard>
</template>
