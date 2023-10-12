import { IFeatureFlag } from './feature-flag.interface'

export interface IAppFeatures {
    themes: {
        dark: IFeatureFlag
        system: IFeatureFlag
    }
    translations: {
        system: IFeatureFlag
        languages: {
            en: IFeatureFlag
        }
    }
}
