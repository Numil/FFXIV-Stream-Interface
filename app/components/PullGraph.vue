<script setup lang="ts">
const { data } = defineProps<{
    data: {
        count: number
        pullPercent: number
        phase: number
    }[]
    maxPhase: number
}>()

const yFormatter = (tick: number) => {
    return `${Math.abs(tick)}`
}
</script>

<template>
    <UCard
        variant="soft"
    >
        <template
            #header
        >
            <h1 class="text-2xl font-bold">
                Pull Graph
            </h1>
        </template>
        <LineChart
            :data="data"
            :categories="{
                pullPercent: {
                    name: 'Pull Percent'
                }
            }"
            :y-num-ticks="maxPhase"
            :height="250"
            :y-domain-line="true"
            :y-formatter="yFormatter"
            :y-domain="[maxPhase, 1]"
            :x-domain-line="true"
            :x-tick-line="true"
            :curve-type="CurveType.Linear"
        />
    </UCard>
</template>
