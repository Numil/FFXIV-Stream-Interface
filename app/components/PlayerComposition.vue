<script setup lang="ts">
const { composition, isStats = false } = defineProps<{
    composition: PlayerDetails
    isStats?: boolean
}>()
</script>

<template>
    <div class="flex flex-col gap-2 px-4 py-2 rounded-2xl justify-end">
        <div
            v-for="role in Object.keys(composition).sort((a, b) => {
                const order: Record<string, number> = {
                    tanks: 0,
                    healers: 1,
                    dps: 2
                }
                return (order[a] ?? 3) - (order[b] ?? 3)
            })"
            :key="role"
            class="flex flex-wrap w-full relative"
        >
            <div class="flex gap-4 overflow-hidden">
                <div
                    v-for="player in composition[
                        role as keyof typeof composition
                    ]"
                    :key="player.name"
                    :class="{
                        'drop-shadow-[2px_2px_0px_rgba(0,0,0,0.6)]': !isStats
                    }"
                    class="flex shrink-0 gap-2 items-center text-lg"
                >
                    <NuxtImg
                        class="size-8"
                        :src="JobImages[player.type as keyof typeof JobImages]"
                        alt="player avatar"
                    />
                    {{ player.name }}
                </div>
            </div>
        </div>
    </div>
</template>
