<script setup lang="ts">
import { JobImages } from '~/interfaces/UI'

const { currentEncounter } = useRace()

const pullCount = computed<number | undefined>(
    () => currentEncounter.value?.pullCount
)

const bestPullPercent = computed<string | undefined>(
    () => currentEncounter.value?.bestPercentForDisplay
)

const bestPhase = computed<number | undefined>(
    () => currentEncounter.value?.bestPhaseIndex
)
</script>

<template>
    <div
        v-if="currentEncounter"
        class="relative flex flex-col w-fit h-fit border-r-[6px] rounded-tr-2xl border-t-[6px] border-blue-200 border-opacity-40 overflow-hidden"
    >
        <img
            class="absolute aspect-video object-cover h-[512px]"
            src="https://lds-img.finalfantasyxiv.com/promo/h/z/nVf84KvM4bFI3frwvuvd3vZhKc.jpg"
        />
        <div
            class="h-[512px] justify-between flex p-4 flex-col z-20 text-purple-50 font-extrabold uppercase"
        >
            <div
                class="flex bg-black bg-opacity-60 px-3 py-2 rounded-2xl w-fit flex-col"
            >
                <div
                    class="drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)] flex flex-col gap-1"
                >
                    <div class="text-[3rem] leading-[3rem]">Best pull</div>
                    <span
                        class="text-[3rem] leading-[3rem]"
                        v-if="bestPhase !== undefined"
                    >
                        Phase {{ bestPhase + 1 }} - {{ bestPullPercent }}
                    </span>
                    <div class="text-[2rem] leading-[2rem]">
                        {{ pullCount }} pulls
                    </div>
                </div>
            </div>
            <div
                class="bg-black bg-opacity-60 flex flex-col gap-2 px-4 py-2 rounded-2xl justify-end"
            >
                <div
                    class="flex flex-wrap w-full relative"
                    v-for="role in currentEncounter?.composition?.roles"
                >
                    <div class="flex gap-4 overflow-hidden">
                        <div
                            class="flex shrink-0 gap-2 items-center text-lg drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]"
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
