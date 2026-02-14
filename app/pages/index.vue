<script setup lang="ts">
import { Fights } from '~~/shared/types/Fights'

const route = useRoute()

const encounterId = route.query.encounterId as string | undefined
const mode = encounterId ? 'nonRace' : 'race'

const fightId =
    (route.query.fightId as string) ||
    (route.query.zoneId as string) ||
    undefined

const phases = Number(route.query.phases) || 0

const {
    bestPullPercent,
    bestPhase,
    isCleared,
    pullCount,
    composition,
    encounterCount,
    currentEncounterIndex
} = mode === 'nonRace'
    ? useNonRaceFight(route.query.zoneId as string, encounterId!, 100000)
    : useRace(fightId)

const bestPullDisplay = computed(() => {
    if (mode === 'nonRace' && bestPullPercent.value !== undefined) {
        return `${bestPullPercent.value} %`
    }
    return bestPullPercent.value
})

const fightStyleData = Fights.find((fight) => fight.id === fightId)
const fightImages = fightStyleData?.phases || []

const phaseImageLink = computed<string | undefined>(() => {
    if (fightImages.length === 0) return 'clear.png'
    if (isCleared.value) return 'clear.png'

    if (encounterCount.value > 1) {
        return fightImages[currentEncounterIndex.value]
    }

    return fightImages[(bestPhase.value ?? 1) - 1]
})

const roundedStyle = computed<string>(
    () => (route.query.rounded as string) || '0'
)

const borderStyle = computed<string>(
    () => (route.query.border as string) || '0'
)

useSeoMeta({
    title: fightStyleData
        ? `${fightStyleData.name} - Raid Tracker`
        : 'Raid Tracker',
    ogImage: phaseImageLink.value,
    twitterImage: phaseImageLink.value,
    twitterCard: 'summary_large_image'
})
</script>

<template>
    <div
        v-if="bestPhase"
        class="relative flex flex-col w-fit h-fit border-slate-200/60 overflow-hidden min-w-[820px]"
        :style="{ borderRadius: roundedStyle, borderWidth: borderStyle }"
        @click="
            mode === 'nonRace'
                ? navigateTo({
                      name: 'stats-nonRace',
                      query: route.query
                  })
                : undefined
        "
    >
        <NuxtImg
            class="absolute aspect-video object-cover h-[512px]"
            :src="phaseImageLink"
        />
        <div
            class="h-[512px] flex p-4 gap-4 flex-col z-20 text-slate-50 font-extrabold uppercase radial-gradient"
            :class="[
                fightStyleData?.customPhaseStyles?.find(
                    (style) => style.phase === bestPhase
                )?.pullJustify || 'justify-between'
            ]"
        >
            <div
                class="flex px-3 py-2 rounded-2xl w-fit flex-col"
                :class="[
                    fightStyleData?.customPhaseStyles?.find(
                        (style) => style.phase === bestPhase
                    )?.pullPosition,
                    fightStyleData?.customPhaseStyles?.find(
                        (style) => style.phase === bestPhase
                    )?.theme === 'light'
                        ? 'bg-white/20'
                        : 'bg-black/60'
                ]"
            >
                <div
                    class="drop-shadow-[2px_2px_0px_rgba(0,0,0,0.6)] flex flex-col gap-1"
                >
                    <div
                        v-if="encounterCount > 1"
                        class="text-[3rem] leading-[3rem]"
                    >
                        Progress
                        {{ isCleared ? currentEncounterIndex + 1 : currentEncounterIndex }}
                        / {{ encounterCount }}
                    </div>
                    <div
                        v-if="mode === 'nonRace' && phases !== 1"
                        class="text-[3rem] leading-[3rem]"
                    >
                        Phase {{ bestPhase }}
                    </div>
                    <div v-if="!isCleared" class="text-[3rem] leading-[3rem]">
                        Best pull
                    </div>
                    <span
                        v-if="bestPhase !== undefined && !isCleared"
                        class="text-[3rem] leading-[3rem]"
                    >
                        {{ bestPullDisplay }}
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
                :class="[
                    fightStyleData?.customPhaseStyles?.find(
                        (style) => style.phase === bestPhase
                    )?.theme === 'light'
                        ? 'bg-white/20'
                        : 'bg-black/60'
                ]"
            >
                <div
                    v-if="!composition"
                    class="text-4xl drop-shadow-[2px_2px_0px_rgba(0,0,0,0.6)] text-center"
                >
                    HYPE (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧
                </div>

                <PlayerComposition v-if="composition" :composition />
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
