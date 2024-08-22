import BLOOM_UI_PRESET from '@bloomwalletio/ui/tailwind-preset'
import { exposeDarkModeStrategy } from '@bloomwalletio/ui/darkmode'

/* Utilities */
const pxToRem = (px, base = 16) => `${px / base}rem`

const SHARED_CONTENT_ROUTES = ['../shared/**/*.svelte']
const DESKTOP_CONTENT_ROUTES = ['../desktop/**/*.svelte']
const NODE_MODULES_ROUTES = ['../../node_modules/@bloomwalletio/ui/**/*.{html,js,svelte,ts}']

export default {
    content: [...SHARED_CONTENT_ROUTES, ...NODE_MODULES_ROUTES, ...DESKTOP_CONTENT_ROUTES],
    presets: [BLOOM_UI_PRESET],
    plugins: [exposeDarkModeStrategy],
    theme: {
        extend: {
            ...BLOOM_UI_PRESET?.theme?.extend,
            fontSize: {
                8: pxToRem(8),
                9: pxToRem(9),
                10: pxToRem(10),
                11: pxToRem(11),
                12: pxToRem(12),
                13: pxToRem(13),
                14: pxToRem(14),
                15: pxToRem(15),
                16: pxToRem(16),
                18: pxToRem(18),
                20: pxToRem(20),
                22: pxToRem(22),
                24: pxToRem(24),
                28: pxToRem(28),
                30: pxToRem(30),
                32: pxToRem(32),
                36: pxToRem(36),
                48: pxToRem(48),
                64: pxToRem(64),
            },
            lineHeight: {
                3.5: pxToRem(14),
                100: '100%',
                110: '110%',
                120: '120%',
                130: '130%',
                140: '140%',
                150: '150%',
                160: '160%',
                170: '170%',
                180: '180%',
                190: '190%',
                200: '200%',
            },
            fontWeight: {
                100: '100',
                200: '200',
                300: '300',
                400: '400',
                500: '500',
                600: '600',
                700: '700',
                800: '800',
                900: '900',
            },
            keyframes: {
                spinReverse: {
                    from: {
                        transform: 'rotate(360deg)',
                    },
                    to: {
                        transform: 'rotate(0deg)',
                    },
                },
                shake: {
                    '8%, 41%': {
                        transform: 'translateX(-10px)',
                    },
                    '25%, 58%': {
                        transform: 'translateX(10px)',
                    },
                    '75%': {
                        transform: 'translateX(-5px)',
                    },
                    '92%': {
                        transform: 'translateX(5px)',
                    },
                    '0%, 100%': {
                        transform: 'translateX(0)',
                    },
                },
            },
            animation: {
                'spin-reverse': 'spinReverse 1s linear infinite;',
                shake: 'shake .5s linear;',
            },
            boxShadow: {
                'elevation-1': '0px 1px 2px rgba(0, 0, 0, 0.08)',
                'elevation-2': '0px 2px 6px rgba(0, 0, 0, 0.08)',
                'elevation-3': '0px 4px 6px rgba(0, 0, 0, 0.08)',
                'elevation-4': '0px 4px 12px rgba(0, 0, 0, 0.12)',
            },
            borderWidth: {
                3: '3px',
            },
            spacing: {
                4.5: pxToRem('18'),
                6.75: pxToRem('27'),
                10: pxToRem('40'),
                18: pxToRem('72'),
                98: pxToRem('392'),
            },
            borderRadius: {
                2: pxToRem(2),
                4: pxToRem(4),
                6: pxToRem(6),
                8: pxToRem(8),
                10: pxToRem(10),
                12: pxToRem(12),
                16: pxToRem(16),
                24: pxToRem(24),
            },
            maxHeight: {
                xl: pxToRem(648),
                100: pxToRem(400),
            },
            height: {
                fit: 'fit-content',
            },
            width: {
                100: pxToRem(400),
            },
        },
        fontFamily: {
            'fira-mono': ['"Fira Mono"', 'monospace'],
            silka: ['Silka'],
        },
    },
}
