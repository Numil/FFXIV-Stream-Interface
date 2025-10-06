<script setup lang="ts">
const { numberOfPullPerPhase } = defineProps<{
    numberOfPullPerPhase: Record<number, number>
}>()

const data = computed(() => {
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
            color: 'white',
            name: 'Number of Pull'
        }
    }
})

const yFormatter = (index: number) => {
    return `Phase ${index + 1}`
}
</script>

<template>
    <UCard class="col-span-3" variant="soft">
        <template #header>Pulls per phase</template>

        <ClientOnly>
            <BarChart
                :orientation="Orientation.Horizontal"
                :data="data"
                :height="250"
                :categories="chartCategories"
                :y-formatter="yFormatter"
                :yAxis="['numberOfPull']"
            />
        </ClientOnly>
    </UCard>
</template>
