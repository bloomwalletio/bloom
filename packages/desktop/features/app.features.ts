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
            de: false,
            tr: true,
        },
    },
    particles: {
        enabled: false,
    },
}

export default appFeatures
