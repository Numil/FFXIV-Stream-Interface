import { gql } from 'graphql-request'
import type { APIResponse } from '~/interfaces/API'
import type { FightIDsWithReport, ReportDataObject } from '~/interfaces/Deaths'

export default (fightIDsPerReports: Ref<FightIDsWithReport>) => {
    const authToken = useAuthToken()

    const getDeathsDocument = (reportCode: string, fightIDs: number[]) => gql`
        query {
            reportData {
                report(code: "${reportCode}") {
                    table(dataType: Deaths, fightIDs: [${fightIDs}]) 
                }
            }
        }
    `

    const deathCounts = ref(0)

    let previousFightIDsPerReports: FightIDsWithReport = {}

    watch(
        fightIDsPerReports,
        async () => {
            await onUpdatedReports()
        },
        { deep: true }
    )

    const fetchFightsData = async (reportCode: string, fightIDs: number[]) =>
        await $fetch<APIResponse<ReportDataObject>>(`/fflogs/api/v2/client`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken.value}`
            },
            body: JSON.stringify({
                query: getDeathsDocument(reportCode, fightIDs)
            })
        })

    const getDeathsData = async (value: FightIDsWithReport) => {
        for (const reportCode in value) {
            // We make chunks of 10 fight IDs to avoid hitting the API limit
            const fightIDsChunks = chunkFights(value[reportCode], 10)

            for (const chunk of fightIDsChunks) {
                const response = await fetchFightsData(reportCode, chunk)

                // We add the number of deaths events to the total
                deathCounts.value +=
                    response.data.reportData.report.table.data.entries.length
            }
        }
    }

    const onUpdatedReports = async () => {
        // We only get the reports that have new data
        const changedReports = Object.keys(fightIDsPerReports.value).filter(
            (reportCode) =>
                !previousFightIDsPerReports.hasOwnProperty(reportCode) ||
                previousFightIDsPerReports[reportCode].length !==
                    fightIDsPerReports.value[reportCode].length
        )

        if (changedReports.length > 0) {
            // We create a new object with the fight IDs that were not present in the previous object
            const newFightIDsPerReports: FightIDsWithReport = {}

            changedReports.forEach((reportCode) => {
                newFightIDsPerReports[reportCode] = fightIDsPerReports.value[
                    reportCode
                ].filter(
                    (fightID) =>
                        !previousFightIDsPerReports.hasOwnProperty(
                            reportCode
                        ) ||
                        !previousFightIDsPerReports[reportCode].includes(
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
