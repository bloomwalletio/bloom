import { IFeatureFlag } from './feature-flag.interface'

export interface IAppFeatures {
    themes: {
        dark: IFeatureFlag
        system: IFeatureFlag
    }
    translations: {
        languages: {
            en: IFeatureFlag
        }
    }
}
