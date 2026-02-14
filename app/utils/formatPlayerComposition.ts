export function formatForPlayerDetails(roles: Role[]): PlayerDetails {
    const details: PlayerDetails = { tanks: [], healers: [], dps: [] }

    for (const role of roles) {
        const name = role.name.toLowerCase()
        const players: PlayerDTO[] = role.players.map((player) => ({
            name: player.name,
            id: player.guid,
            guid: player.guid,
            type: player.type
        }))

        if (name.includes('tank')) {
            details.tanks.push(...players)
        } else if (name.includes('heal')) {
            details.healers.push(...players)
        } else {
            details.dps.push(...players)
        }
    }

    return details
}
