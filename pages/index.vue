<script setup lang="ts">
import { JobImages } from '~/interfaces/UI'

const { currentEncounter } = useRace()

const pullCount = computed<number | undefined>(
    () => currentEncounter.value?.pullCount
)

const bestPullPercent = computed<string | undefined>(
    () => currentEncounter.value?.bestPercentForDisplay
)

const bestPhase = computed<number>(
    () => (currentEncounter.value?.bestPhaseIndex || 0) + 1
)

const isCleared = computed<boolean>(() => !!currentEncounter.value?.isKilled)

const phaseImages: {
    [key: number]: string
} = {
    1: '/phase1.png',
    2: '/phase2.jpg',
    3: '/phase3.jpg',
    4: '/phase4.png',
    5: '/phase5.png'
}

const phaseImageLink = computed<string | undefined>(() =>
    isCleared.value ? '/clear.png' : phaseImages[bestPhase.value]
)

const roundedStyle = computed<string>(
    () => (useRoute().query.rounded as string) || '0'
)

const borderStyle = computed<string>(
    () => (useRoute().query.border as string) || '0'
)
</script>

<template>
    <div
        v-if="currentEncounter"
        class="relative flex flex-col w-fit h-fit border-slate-200 border-opacity-60 overflow-hidden"
        :style="{ borderRadius: roundedStyle, borderWidth: borderStyle }"
    >
        <img
            class="absolute aspect-video object-cover h-[512px]"
            :src="phaseImageLink"
        />
        <div
            class="h-[512px] flex p-4 gap-4 flex-col z-20 text-slate-50 font-extrabold uppercase radial-gradient"
            :class="[
                bestPhase === 3 || bestPhase === 4
                    ? 'justify-end'
                    : 'justify-between'
            ]"
        >
            <div
                class="flex px-3 py-2 rounded-2xl w-fit flex-col"
                :class="[
                    {
                        'self-end': bestPhase === 3
                    },
                    bestPhase === 4
                        ? 'bg-white bg-opacity-20'
                        : 'bg-black bg-opacity-60'
                ]"
            >
                <div
                    class="drop-shadow-[2px_2px_0px_rgba(0,0,0,0.6)] flex flex-col gap-1"
                >
                    <div class="text-[3rem] leading-[3rem]" v-if="!isCleared">
                        Best pull
                    </div>
                    <span
                        class="text-[3rem] leading-[3rem]"
                        v-if="bestPhase !== undefined && !isCleared"
                    >
                        {{ bestPullPercent }}
                    </span>
                    <span class="text-[3rem] leading-[3rem]" v-else>
                        Cleared
                    </span>
                    <div class="text-[2rem] leading-[2rem]">
                        {{ pullCount }} pulls
                    </div>
                </div>
            </div>
            <div
                class="flex flex-col gap-2 px-4 py-2 rounded-2xl justify-end"
                :class="[
                    bestPhase === 4
                        ? 'bg-white bg-opacity-20'
                        : 'bg-black bg-opacity-60'
                ]"
            >
                <div
                    class="flex flex-wrap w-full relative"
                    v-for="role in currentEncounter?.composition?.roles"
                >
                    <div class="flex gap-4 overflow-hidden">
                        <div
                            class="flex shrink-0 gap-2 items-center text-lg drop-shadow-[2px_2px_0px_rgba(0,0,0,0.6)]"
                            v-for="player in role.players"
                        >
                            <img
                                class="size-8"
                                :src="
                                    JobImages[
                                        player.type as keyof typeof JobImages
                                    ]
                                "
                                alt="player avatar"
                            />
                            {{ player.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
.radial-gradient {
    background: rgb(2, 0, 36);
    background: radial-gradient(
        ellipse at center,
        rgba(2, 0, 36, 0) 0%,
        rgba(255, 255, 255, 0) 50%,
        rgba(0, 0, 0, 60%) 100%
    );
}
</style>
