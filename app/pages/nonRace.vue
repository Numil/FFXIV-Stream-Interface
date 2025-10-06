<script setup lang="ts">
import { Fights } from '~~/shared/types/Fights'

const route = useRoute()

const { zoneId, encounterId, phases } = route.query

const phasesNumber = Number(phases)

const { bestPullPercent, bestPhase, isCleared, pullCount, composition }
    = useNonRaceFight(zoneId as string, encounterId as string, 100000)

const fightId = (useRoute().query.zoneId as string) || undefined

const fightStyleData = Fights.find(fight => fight.id === fightId)
const fightPhases = fightStyleData?.phases || []

const phaseImageLink = computed<string | undefined>(() => {
    if (fightPhases.length === 0 || !bestPhase.value) return 'clear.png'

    return isCleared.value ? 'clear.png' : fightPhases[bestPhase.value - 1]
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
        v-if="bestPhase"
        class="relative flex flex-col w-fit h-fit border-slate-200/60 overflow-hidden min-w-[820px]"
        :style="{ borderRadius: roundedStyle, borderWidth: borderStyle }"
        @click="
            navigateTo({
                name: 'stats-nonRace',
                query: useRoute().query
            })
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
                        v-if="phasesNumber !== 1"
                        class="text-[3rem] leading-[3rem]"
                    >
                        Phase {{ bestPhase }}
                    </div>
                    <div
                        v-if="!isCleared"
                        class="text-[3rem] leading-[3rem]"
                    >
                        Best pull
                    </div>
                    <span
                        v-if="bestPhase !== undefined && !isCleared"
                        class="text-[3rem] leading-[3rem]"
                    >
                        {{ bestPullPercent }} %
                    </span>
                    <span
                        v-else
                        class="text-[3rem] leading-[3rem]"
                    >
                        Cleared
                    </span>
                    <div class="text-[2rem] leading-[2rem]">
                        {{ pullCount }} pulls
                    </div>
                </div>
            </div>
            <div
                v-if="composition"
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
                    v-if="!bestPhase"
                    class="text-4xl drop-shadow-[2px_2px_0px_rgba(0,0,0,0.6)] text-center"
                >
                    HYPE (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧
                </div>

                <PlayerComposition :composition />
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
