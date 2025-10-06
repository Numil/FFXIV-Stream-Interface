<script setup lang="ts">
const fightId = (useRoute().query.fightId as string) || undefined

const { fightIDsPerReports } = useRace(fightId, 60000)

const { deathCounts } = useDeathsCounter(fightIDsPerReports)
</script>

<template>
    <div>
        {{ deathCounts }}
    </div>
</template>
