<script setup lang="ts">
import { Fights } from '~~/shared/types/Fights'
import { JobImages } from '~~/shared/types/UI'

const fightId = (useRoute().query.fightId as string) || undefined

const { currentEncounter, currentEncounterIndex, encounterCount } =
    useRace(fightId)

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

const fightImages = Fights.find((fight) => fight.id === fightId)?.phases || []

const phaseImageLink = computed<string | undefined>(() => {
    if (fightImages.length === 0) return 'clear.png'

    return encounterCount.value !== 1
        ? fightImages[currentEncounterIndex.value]
        : fightImages[bestPhase.value - 1]
})

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
        class="relative flex flex-col w-fit h-fit border-slate-200/60 overflow-hidden min-w-[820px]"
        :style="{ borderRadius: roundedStyle, borderWidth: borderStyle }"
    >
        <NuxtImg
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
                    bestPhase === 4 ? 'bg-white/20' : 'bg-black/60'
                ]"
            >
                <div
                    class="drop-shadow-[2px_2px_0px_rgba(0,0,0,0.6)] flex flex-col gap-1"
                >
                    <div
                        v-if="encounterCount !== 1"
                        class="text-[3rem] leading-[3rem]"
                    >
                        Progress
                        {{
                            currentEncounter?.isKilled
                                ? currentEncounterIndex + 1
                                : currentEncounterIndex
                        }}
                        / {{ encounterCount }}
                    </div>
                    <div v-if="!isCleared" class="text-[3rem] leading-[3rem]">
                        Best pull
                    </div>
                    <span
                        v-if="bestPhase !== undefined && !isCleared"
                        class="text-[3rem] leading-[3rem]"
                    >
                        {{ bestPullPercent }}
                    </span>
                    <span v-else class="text-[3rem] leading-[3rem]">
                        Cleared
                    </span>
                    <div class="text-[2rem] leading-[2rem]">
                        {{ pullCount }} pulls
                    </div>
                </div>
            </div>
            <div
                class="flex flex-col gap-2 px-4 py-2 rounded-2xl justify-end"
                :class="[bestPhase === 4 ? 'bg-white/20' : 'bg-black/60']"
            >
                <div
                    v-if="!currentEncounter?.composition"
                    class="text-4xl drop-shadow-[2px_2px_0px_rgba(0,0,0,0.6)] text-center"
                >
                    HYPE (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧
                </div>

                <div
                    v-for="role in currentEncounter?.composition?.roles"
                    :key="role.name"
                    class="flex flex-wrap w-full relative"
                >
                    <div class="flex gap-4 overflow-hidden">
                        <div
                            v-for="player in role.players"
                            :key="player.name"
                            class="flex shrink-0 gap-2 items-center text-lg drop-shadow-[2px_2px_0px_rgba(0,0,0,0.6)]"
                        >
                            <NuxtImg
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
