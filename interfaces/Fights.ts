export interface Fight {
    id: string
    name: string
    phases: string[]
    customPhaseStyles?: {
        phase?: number
        theme?: 'light' | 'dark'
        pullJustify?: 'justify-end' | 'justify-between'
        pullPosition?: 'self-end' | 'self-start'
    }[]
}

export const Fights: Fight[] = [
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
        id: '59',
        name: 'TOP',
        phases: [
            '/TOP/phase1.png',
            '/TOP/phase2.jpg',
            '/TOP/phase3.png',
            '/TOP/phase4.png',
            '/TOP/phase5.png',
            '/TOP/phase6.png'
        ],
        customPhaseStyles: [
            {
                phase: 2,
                theme: 'light'
            },
            {
                phase: 3,
                pullPosition: 'self-end'
            },
            {
                phase: 4,
                pullPosition: 'self-end'
            },
            {
                phase: 5,
                pullPosition: 'self-end'
            }
        ]
    }
]
