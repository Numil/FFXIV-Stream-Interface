<script setup lang="ts">
const { bestPhase, bestPullPercent, pullCount, numberOfPullsSincePB }
    = defineProps<{
        bestPhase: number
        bestPullPercent: number
        pullCount: number
        numberOfPullsSincePB: number | undefined
    }>()
</script>

<template>
    <UCard variant="soft">
        <template #header>
            <h1 class="text-2xl font-bold">
                Best Pull
            </h1>
        </template>
        <div class="text-sm">
            Phase: {{ bestPhase }}
        </div>
        <div class="text-2xl font-semibold">
            {{ bestPullPercent }} %
        </div>
    </UCard>
    <UCard variant="soft">
        <template #header>
            <h1 class="text-2xl font-bold">
                Pull count
            </h1>
        </template>
        <div class="text-sm font-light">
            Total
        </div>
        <div class="text-2xl font-semibold">
            {{ pullCount }}
        </div>
    </UCard>
    <UCard variant="soft">
        <template #header>
            <h1 class="text-2xl font-bold">
                Pulls since best pull
            </h1>
        </template>
        <div class="text-sm font-light">
            Total
        </div>
        <div class="text-2xl font-semibold">
            {{ numberOfPullsSincePB ?? 0 }}
        </div>
    </UCard>
</template>
