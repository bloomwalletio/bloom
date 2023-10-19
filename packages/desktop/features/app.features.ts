import { IAppFeatures } from '@lib/features/interfaces'

const appFeatures: IAppFeatures = {
    themes: {
        dark: {
            enabled: true,
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
