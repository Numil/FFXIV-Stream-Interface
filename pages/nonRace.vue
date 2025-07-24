<script setup lang="ts">
import { Fights } from '~/interfaces/Fights'
import { JobImages } from '~/interfaces/UI'
const route = useRoute()

const { zoneId, encounterId, phases } = route.query

const phasesNumber = Number(phases)

const { bestPullPercent, bestPhase, isCleared, pullCount, composition } =
    useNonRaceFight(zoneId as string, encounterId as string, 100000)

const fightId = (useRoute().query.zoneId as string) || undefined

const fightStyleData = Fights.find((fight) => fight.id === fightId)
const fightPhases = fightStyleData?.phases || []

const phaseImageLink = computed<string | undefined>(() => {
    if (fightPhases.length === 0) return 'clear.png'

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
        class="relative flex flex-col w-fit h-fit border-slate-200 border-opacity-60 overflow-hidden min-w-[820px]"
        :style="{ borderRadius: roundedStyle, borderWidth: borderStyle }"
    >
        <img
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
                        ? 'bg-white bg-opacity-20'
                        : 'bg-black bg-opacity-60'
                ]"
            >
                <div
                    class="drop-shadow-[2px_2px_0px_rgba(0,0,0,0.6)] flex flex-col gap-1"
                >
                    <div
                        class="text-[3rem] leading-[3rem]"
                        v-if="phasesNumber !== 1"
                    >
                        Progress
                        {{ bestPhase - 1 }}
                        / {{ phasesNumber }}
                    </div>
                    <div class="text-[3rem] leading-[3rem]" v-if="!isCleared">
                        Best pull
                    </div>
                    <span
                        class="text-[3rem] leading-[3rem]"
                        v-if="bestPhase !== undefined && !isCleared"
                    >
                        {{ bestPullPercent }} %
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
                v-if="composition"
                class="flex flex-col gap-2 px-4 py-2 rounded-2xl justify-end"
                :class="[
                    fightStyleData?.customPhaseStyles?.find(
                        (style) => style.phase === bestPhase
                    )?.theme === 'light'
                        ? 'bg-white bg-opacity-20'
                        : 'bg-black bg-opacity-60'
                ]"
            >
                <div
                    class="text-4xl drop-shadow-[2px_2px_0px_rgba(0,0,0,0.6)] text-center"
                    v-if="!bestPhase"
                >
                    HYPE (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧
                </div>

                <div
                    class="flex flex-wrap w-full relative"
                    v-for="role in Object.keys(composition).sort((a, b) => {
                        const order: Record<string, number> = {
                            tanks: 0,
                            healers: 1,
                            dps: 2
                        }
                        return (order[a] ?? 3) - (order[b] ?? 3)
                    })"
                >
                    <div class="flex gap-4 overflow-hidden">
                        <div
                            class="flex shrink-0 gap-2 items-center text-lg drop-shadow-[2px_2px_0px_rgba(0,0,0,0.6)]"
                            v-for="player in composition[
                                role as keyof typeof composition
                            ]"
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
