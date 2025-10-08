<script setup lang="ts">
const { numberOfPullsInBetweenEachPB, pullCount } = defineProps<{
    numberOfPullsInBetweenEachPB: PBs[]
    pullCount: number
}>()

const randomOpacity = () => {
    const opacity = Math.random()
    return opacity > 0.5 ? opacity : 1 - opacity
}

const getPullWidth = (previousPull: PBs, currentPull: PBs) => {
    return (
        ((currentPull.pullNumber - previousPull.pullNumber) / pullCount) * 100 +
        1
    )
}
</script>

<template>
    <UCard variant="soft" class="col-span-3">
        <template #header>
            <h1 class="text-2xl font-bold">Progress between PBs</h1>
        </template>
        <div v-if="numberOfPullsInBetweenEachPB && !pullCount">
            <div class="animate-pulse rounded-2xl bg-accented h-12" />
        </div>

        <div v-else class="col-span-3 flex flex-row rounded-xl overflow-hidden">
            <UTooltip
                :text="`Pull ${pull.pullNumber} - Phase ${pull.pull.lastPhase} - ${pull.pull.bossPercentage}%`"
                :delay-duration="0"
                :arrow="true"
                :content="{
                    side: 'top'
                }"
                v-for="(pull, index) in numberOfPullsInBetweenEachPB"
                :key="pull.pullNumber"
            >
                <div
                    :style="{
                        width:
                            index !== 0
                                ? `${getPullWidth(numberOfPullsInBetweenEachPB[index - 1]!, pull)}%`
                                : '1%',
                        backgroundColor: `rgba(49, 65, 88, ${randomOpacity()})` // #314158
                    }"
                    :aria-rowindex="index"
                    ref="pullsRef"
                    class="flex flex-row h-10 justify-center items-center w-full bg-slate-700 overflow-hidden outline outline-slate-800"
                >
                    <div
                        v-if="
                            index !== 0 &&
                            getPullWidth(
                                numberOfPullsInBetweenEachPB[index - 1]!,
                                pull
                            ) > 5
                        "
                        class="text-white opacity-100"
                    >
                        <div class="mx-2">
                            #{{ pull.pullNumber }}
                        </div>
                    </div>
                </div>
            </UTooltip>
        </div>
    </UCard>
</template>
