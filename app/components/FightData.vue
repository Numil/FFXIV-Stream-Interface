<script setup lang="ts">
const { bestPhase, bestPullPercent, pullCount, numberOfPullsSincePB }
    = defineProps<{
        bestPhase?: number
        bestPullPercent?: number
        pullCount?: number
        numberOfPullsSincePB: number | undefined
        loading: boolean
    }>()

const data = computed<{
    title: string
    value: string | number | undefined
    description?: string
}[]>(() => {
    return [
        {
            title: 'Best pull',
            value: `${bestPullPercent}%`,
            description: `Phase: ${bestPhase}`
        },
        {
            title: 'Pull count',
            value: pullCount
        },
        {
            title: 'Pulls since PB',
            value: numberOfPullsSincePB
        }
    ]
})
</script>

<template>
    <UCard
        v-for="item in data"
        :key="item.title"
        variant="soft"
        :ui="{
            root: 'flex flex-col',
            body: 'flex-1'
        }"
    >
        <template #header>
            <h1 class="text-2xl text-center">
                {{ item.title }}
            </h1>
        </template>
        <div
            v-if="loading"
            class="animate-pulse rounded-2xl bg-accented h-12"
        />
        <div
            v-else
            class="h-full text-2xl font-extrabold text-center flex flex-col items-center justify-center"
        >
            <span
                v-if="item.description"
                class="text-sm font-normal"
            >
                {{ item.description }}
            </span>
            {{ item.value }}
        </div>
    </UCard>
</template>
