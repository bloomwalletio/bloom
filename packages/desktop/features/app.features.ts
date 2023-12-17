import { IAppFeatures } from '@lib/features/interfaces'

const appFeatures: IAppFeatures = {
    themes: {
        light: {
            enabled: true,
        },
        dark: {
            enabled: true,
        },
        system: {
            enabled: true,
        },
    },
    translations: {
        languages: {
            en: true,
            de: true,
            tr: true,
            nl: true,
            pl: true,
        },
    },
    particles: {
        enabled: false,
    },
}

export default appFeatures
