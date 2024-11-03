<script setup lang="ts">
const { fightIDsPerReports } = useRace(60000)

const { deathCounts } = useDeathsCounter(fightIDsPerReports)
</script>

<template>{{ deathCounts }}</template>
