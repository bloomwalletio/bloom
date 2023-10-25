import { IAppFeatures } from '@lib/features/interfaces'

const appFeatures: IAppFeatures = {
    themes: {
        light: {
            enabled: true,
        },
        dark: {
            enabled: false,
        },
        system: {
            enabled: false,
        },
    },
    translations: {
        languages: {
            en: true,
            de: false,
        },
    },
}

export default appFeatures
