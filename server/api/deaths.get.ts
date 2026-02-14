import { gql } from 'graphql-request'

export default defineCachedEventHandler(
    async (event) => {
        const { reportCode, fightIDs } = getQuery(event)

        if (!reportCode || !fightIDs) {
            throw createError({
                statusCode: 400,
                statusMessage: 'reportCode and fightIDs are required'
            })
        }

        const fightIDsArray = (fightIDs as string).split(',').map(Number)

        const deathsDocument = gql`
        query {
            reportData {
                report(code: "${reportCode}") {
                    table(dataType: Deaths, fightIDs: [${fightIDsArray}])
                }
            }
        }
    `

        const response = await fflogsQuery<ReportDataObject>(deathsDocument)

        return {
            deathCount:
                response.data.reportData.report.table.data.entries.length
        }
    },
    {
        maxAge: 300,
        getKey: (event) => {
            const { reportCode, fightIDs } = getQuery(event)
            return `deaths:${reportCode}:${fightIDs}`
        }
    }
)
