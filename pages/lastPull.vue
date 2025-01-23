<script setup lang="ts">
const { lastPull } = useRace()

const lastPullPercent = computed(() => lastPull.value?.bestPercentForDisplay)
const lastPullPhase = computed(() => lastPull.value?.lastPhase)

const roundedStyle = computed<string>(
    () => (useRoute().query.rounded as string) || '0'
)

const phaseImages: {
    [key: number]: string
} = {
    1: '/phase1.png',
    2: '/phase2.jpg',
    3: '/phase3.jpg',
    4: '/phase4.png',
    5: '/phase5.png'
}

const phaseImageLink = computed<string | undefined>(
    () => phaseImages[lastPullPhase.value.number]
)

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
