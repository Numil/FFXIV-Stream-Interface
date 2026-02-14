import type {
    FightDTO as FightDTOResponse,
    PlayerDetailsDTO
} from '#shared/types/FightDTO'
import type { PBs } from '#shared/types/UI'
import { gql } from 'graphql-request'

export default defineCachedEventHandler(
    async (event) => {
        const { zoneId, encounterId } = getQuery(event)

        if (!zoneId || !encounterId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'zoneId and encounterId are required'
            })
        }

        const { guildId } = useRuntimeConfig()

        const raceDocument = gql`
        query {
            reportData {
                reports(guildID: ${guildId}, zoneID: ${zoneId}) {
                    data {
                        fights(encounterID: ${encounterId}) {
                            bossPercentage
                            lastPhase
                            id
                            endTime
                        }
                    }
                }
            }
        }
    `

        const fightResponse = await fflogsQuery<FightDTOResponse>(raceDocument)

        const mergedFights: NonRaceFight[] =
            fightResponse.data.reportData.reports.data
                .map((report) => report.fights)
                .flat()

        const dedupedFights = mergedFights
            .filter(
                (fight, index, self) =>
                    index === self.findIndex((t) => t.endTime === fight.endTime)
            )
            .reverse()

        // Find best pull
        const bestPullFight = [...dedupedFights]
            .sort((a, b) => a.bossPercentage - b.bossPercentage)
            .sort((a, b) => b.lastPhase - a.lastPhase)[0]

        const bestPhase = bestPullFight?.lastPhase
        const bestPullPercent = bestPullFight?.bossPercentage
        const pullCount = dedupedFights.length
        const isCleared =
            bestPullPercent !== undefined ? bestPullPercent <= 0.1 : false

        // Fetch composition from last fight
        const lastFight = dedupedFights[dedupedFights.length - 1]
        let composition = null

        if (lastFight) {
            const compositionDocument = gql`
            query {
                reportData {
                    reports(guildID: ${guildId}, zoneID: ${zoneId}) {
                        data {
                            playerDetails(fightIDs: ${lastFight.id}, encounterID: ${encounterId}, endTime: ${lastFight.endTime})
                        }
                    }
                }
            }
        `

            const compositionResponse =
                await fflogsQuery<PlayerDetailsDTO>(compositionDocument)

            composition =
                compositionResponse.data.reportData.reports.data.find(
                    (d) => !Array.isArray(d.playerDetails.data.playerDetails)
                )?.playerDetails.data.playerDetails || null
        }

        // Compute PBs
        const numberOfPullsInBetweenEachPB: PBs[] = []

        if (dedupedFights.length > 0) {
            numberOfPullsInBetweenEachPB.push({
                pullNumber: 0,
                pull: {
                    lastPhase: dedupedFights[0]!.lastPhase,
                    bossPercentage: dedupedFights[0]!.bossPercentage
                }
            })

            for (let i = 1; i < dedupedFights.length; i++) {
                const currentFight = dedupedFights[i]!
                const PBIndex = numberOfPullsInBetweenEachPB.length - 1
                const previousPB = numberOfPullsInBetweenEachPB[PBIndex]

                if (currentFight.lastPhase > previousPB!.pull.lastPhase) {
                    numberOfPullsInBetweenEachPB.push({
                        pullNumber: i,
                        pull: {
                            lastPhase: currentFight.lastPhase,
                            bossPercentage: currentFight.bossPercentage
                        }
                    })
                }

                if (
                    currentFight.lastPhase === previousPB!.pull.lastPhase &&
                    currentFight.bossPercentage <=
                        previousPB!.pull.bossPercentage
                ) {
                    numberOfPullsInBetweenEachPB.push({
                        pullNumber: i,
                        pull: {
                            lastPhase: currentFight.lastPhase,
                            bossPercentage: currentFight.bossPercentage
                        }
                    })
                }
            }
        }

        return {
            bestPullPercent,
            bestPhase,
            isCleared,
            pullCount,
            composition,
            data: dedupedFights,
            numberOfPullsInBetweenEachPB
        }
    },
    {
        maxAge: 30,
        getKey: (event) => {
            const { zoneId, encounterId } = getQuery(event)
            return `non-race:${zoneId}:${encounterId}`
        }
    }
)
