<template>
    <UApp>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

onBeforeMount(() => {
    colorMode.value = 'dark'
})
</script>
