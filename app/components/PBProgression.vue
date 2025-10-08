<script setup lang="ts">
const { numberOfPullsInBetweenEachPB, pullCount } = defineProps<{
    numberOfPullsInBetweenEachPB: PBs[]
    pullCount: number
}>()

const randomOpacity = () => {
    const opacity = Math.random()
    return opacity > 0.5 ? opacity : 1 - opacity
}

const getPullWidth = (pullIndex: number, nextPullIndex: number) => {
    if (nextPullIndex < numberOfPullsInBetweenEachPB.length - 1) {
        return (
            ((getPullCountBetweenPBs(numberOfPullsInBetweenEachPB[pullIndex]!, numberOfPullsInBetweenEachPB[nextPullIndex]!) / pullCount) * 100)
        )
    }

    return ((pullCount - numberOfPullsInBetweenEachPB[pullIndex]!.pullNumber) / pullCount * 100)
}

const getPullCountBetweenPBs = (currentPull: PBs, nextPull: PBs) => {
    return nextPull.pullNumber - currentPull.pullNumber
}

const getPullCountBetweenPBsText = (pullIndex: number, nextPullIndex: number) => {
    if (nextPullIndex <= numberOfPullsInBetweenEachPB.length - 1) {
        return `It lasted ${getPullCountBetweenPBs(numberOfPullsInBetweenEachPB[pullIndex]!, numberOfPullsInBetweenEachPB[nextPullIndex]!)} pulls`
    }

    return `It's been ${pullCount - numberOfPullsInBetweenEachPB[pullIndex]!.pullNumber} pulls`
}
</script>

<template>
    <UCard
        variant="soft"
        class="col-span-3"
    >
        <template #header>
            <h1 class="text-2xl font-bold">
                Progress between PBs
            </h1>
        </template>
        <div v-if="numberOfPullsInBetweenEachPB && !pullCount">
            <div class="animate-pulse rounded-2xl bg-accented h-12" />
        </div>

        <div
            v-else
            class="col-span-3 flex flex-row rounded-xl overflow-hidden"
        >
            <UTooltip
                v-for="(pull, index) in numberOfPullsInBetweenEachPB"
                :key="pull.pullNumber"
                :text="`Pull ${pull.pullNumber} - Phase ${pull.pull.lastPhase} - ${pull.pull.bossPercentage}% - ${getPullCountBetweenPBsText(index, index + 1)}`"
                :delay-duration="0"
                :arrow="true"
                :content="{
                    side: 'top'
                }"
            >
                <div
                    ref="pullsRef"
                    :style="{
                        width: `${getPullWidth(index, index + 1)}%`,
                        backgroundColor: `rgba(49, 65, 88, ${randomOpacity()})` // #314158
                    }"
                    :aria-rowindex="index"
                    class="flex flex-row h-10 justify-center items-center w-full bg-slate-700 overflow-hidden outline outline-slate-800"
                >
                    <div
                        v-if="getPullWidth(index, index + 1) > 5"
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
