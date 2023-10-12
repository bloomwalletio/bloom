import { IAppFeatures } from '@lib/features/interfaces'

const appFeatures: IAppFeatures = {
    themes: {
        dark: {
            enabled: false,
        },
        system: {
            enabled: false,
        },
    },
    translations: {
        languages: {
            en: {
                enabled: true,
            },
        },
    },
}

export default appFeatures
