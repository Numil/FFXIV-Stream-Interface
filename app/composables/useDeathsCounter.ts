export default (fightIDsPerReports: Ref<FightIDsWithReport>) => {
    const deathCounts = ref(0)

    let previousFightIDsPerReports: FightIDsWithReport = {}

    watch(
        fightIDsPerReports,
        async () => {
            await onUpdatedReports()
        },
        { deep: true }
    )

    const fetchDeathCount = async (reportCode: string, fightIDs: number[]) => {
        const response = await $fetch('/api/deaths', {
            params: {
                reportCode,
                fightIDs: fightIDs.join(',')
            }
        })
        return response.deathCount
    }

    const getDeathsData = async (value: FightIDsWithReport) => {
        for (const reportCode in value) {
            if (!value[reportCode]) continue
            const fightIDsChunks = chunkFights(value[reportCode], 10)

            for (const chunk of fightIDsChunks) {
                const count = await fetchDeathCount(reportCode, chunk)
                deathCounts.value += count
            }
        }
    }

    const onUpdatedReports = async () => {
        const changedReports = Object.keys(fightIDsPerReports.value).filter(
            (reportCode) =>
                !Object.prototype.hasOwnProperty.call(
                    previousFightIDsPerReports,
                    reportCode
                ) ||
                previousFightIDsPerReports[reportCode]?.length !==
                    fightIDsPerReports.value[reportCode]?.length
        )

        if (changedReports.length > 0) {
            const newFightIDsPerReports: FightIDsWithReport = {}

            changedReports.forEach((reportCode) => {
                if (!fightIDsPerReports.value[reportCode]) return

                newFightIDsPerReports[reportCode] = fightIDsPerReports.value[
                    reportCode
                ].filter(
                    (fightID) =>
                        !Object.prototype.hasOwnProperty.call(
                            previousFightIDsPerReports,
                            reportCode
                        ) ||
                        !previousFightIDsPerReports[reportCode]?.includes(
                            fightID
                        )
                )
            })

            getDeathsData(newFightIDsPerReports)
        }

        previousFightIDsPerReports = { ...fightIDsPerReports.value }
    }

    const chunkFights = (array: number[], size: number): number[][] => {
        const result: number[][] = []
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size))
        }
        return result
    }

    return { deathCounts }
}
