import { IFeatureFlag } from './feature-flag.interface'

export interface IAppFeatures {
    themes: {
        light: IFeatureFlag
        dark: IFeatureFlag
        system: IFeatureFlag
    }
    translations: {
        languages: {
            en: boolean
            de: boolean
        }
    }
}
