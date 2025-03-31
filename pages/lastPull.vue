<script setup lang="ts">
import { Fights } from '~/interfaces/Fights'

const fightId = (useRoute().query.fightId as string) || undefined
const { lastPull, currentEncounter, currentEncounterIndex, encounterCount } =
    useRace(fightId)

const lastPullPercent = computed(() => lastPull.value?.bestPercentForDisplay)

const roundedStyle = computed<string>(
    () => (useRoute().query.rounded as string) || '0'
)

const fightImages = Fights.find((fight) => fight.id === fightId)?.phases || []

const bestPhase = computed<number>(
    () => (currentEncounter.value?.bestPhaseIndex || 0) + 1
)

const phaseImageLink = computed<string | undefined>(() => {
    if (fightImages.length === 0) return 'clear.png'

    return encounterCount.value !== 1
        ? fightImages[currentEncounterIndex.value]
        : fightImages[bestPhase.value - 1]
})

const borderStyle = computed<string>(
    () => (useRoute().query.border as string) || '0'
)
</script>

<template>
    <div
        v-if="lastPull"
        class="flex flex-col gap-1 rounded-tr-2xl border-slate-200 border-opacity-60 px-4 py-2 h-fit w-fit *:drop-shadow-[2px_2px_0px_rgba(0,0,0,0.9)] text-slate-50 font-extrabold uppercase text-[3rem]"
        :style="{
            borderRadius: roundedStyle,
            backgroundImage: `url(${phaseImageLink})`,
            borderWidth: borderStyle
        }"
    >
        <span v-if="lastPullPercent">Last pull: {{ lastPullPercent }}</span>
        <!-- {{ phaseImageLink }} -->
        <!-- <span v-if="lastPullPhase">Phase: {{ lastPullPhase }}</span> Already shown in top view -->
    </div>
</template>
