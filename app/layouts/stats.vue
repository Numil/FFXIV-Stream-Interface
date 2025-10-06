<template>
    <UPage>
        <UHeader
            title="Stats"
        >
            <template #right>
                <UButton
                    :to="{
                        name: 'nonRace',
                        query: useRoute().query
                    }"
                >
                    Stream stats
                </UButton>
            </template>
        </UHeader>
        <UPageBody>
            <UContainer>
                <NuxtPage />
            </UContainer>
        </UPageBody>
    </UPage>
</template>
