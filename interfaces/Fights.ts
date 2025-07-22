export interface FightImages {
    id: string
    name: string
    phases: string[]
}

export const Fights: FightImages[] = [
    {
        id: '65',
        name: 'FRU',
        phases: [
            '/FRU/phase1.png',
            '/FRU/phase2.jpg',
            '/FRU/phase3.jpg',
            '/FRU/phase4.png',
            '/FRU/phase5.png'
        ]
    },
    {
        id: '68',
        name: 'ARCCW',
        phases: [
            '/ARCCW/M5_boss.jpg',
            '/ARCCW/M6_boss.jpg',
            '/ARCCW/M7_boss.jpg',
            '/ARCCW/M8_boss.jpg'
        ]
    },
    {
        id: '62',
        name: 'ARCLW',
        phases: [
            '/ARCLW/M1_boss.jpg',
            '/ARCLW/M2_boss.jpg',
            '/ARCLW/M3_boss.jpg',
            '/ARCLW/M4_boss.jpg'
        ]
    },
    {
        id: '53',
        name: 'TOP',
        phases: [
            '/TOP/phase1.png',
            '/TOP/phase2.jpg',
            '/TOP/phase3.png',
            '/TOP/phase4.png',
            '/TOP/phase5.png',
            '/TOP/phase6.png'
        ]
    }
]
