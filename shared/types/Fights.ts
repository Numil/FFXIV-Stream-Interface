export interface FightUI {
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

export const Fights: FightUI[] = [
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
                pullJustify: 'justify-end',
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
    },
    {
        id: '73',
        name: 'ARCHW',
        phases: [
            '/ARCHW/M9_boss.png',
            '/ARCHW/M10_boss.png',
            '/ARCHW/M11_boss.png',
            '/ARCHW/M12_boss.png',
            '/ARCHW/M12P2_boss.png'
        ],
        customPhaseStyles: [
            {
                phase: 1,
                pullPosition: 'self-end',
                pullJustify: 'justify-end'
            },
            {
                phase: 2,
                pullPosition: 'self-end',
                pullJustify: 'justify-end'
            },
            {
                phase: 3,
                pullJustify: 'justify-end'
            },
            {
                phase: 4,
                pullPosition: 'self-end',
                theme: 'light'
            },
            {
                phase: 5,
                pullPosition: 'self-end'
            }
        ]
    }
]
