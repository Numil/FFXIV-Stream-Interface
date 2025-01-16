<script setup lang="ts">
const { lastPull } = useRace()

const lastPullPercent = computed(() => lastPull.value?.bestPercentForDisplay)
const lastPullPhase = computed(() => lastPull.value?.lastPhase)
</script>

<template>
    <div
        v-if="lastPull"
        class="flex flex-col gap-1 bg-blue-200 bg-opacity-40 rounded-tr-2xl px-4 py-2 h-screen w-fit *:drop-shadow-[2px_2px_0px_rgba(0,0,0,0.9)] text-blue-50 font-extrabold uppercase text-[3rem]"
    >
        <span v-if="lastPullPercent">Last pull: {{ lastPullPercent }}</span>
        <!-- <span v-if="lastPullPhase">Phase: {{ lastPullPhase }}</span> Already shown in top view -->
    </div>
</template>
