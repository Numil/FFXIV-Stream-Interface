<script setup lang="ts">
import { Fights } from '~/interfaces/Fights'

const fights = Fights
</script>

<template>
    <div>
        <div v-for="fight in fights" :key="fight.id">
            {{ fight.name }} : {{ fight.id }}
        </div>
    </div>
</template>
