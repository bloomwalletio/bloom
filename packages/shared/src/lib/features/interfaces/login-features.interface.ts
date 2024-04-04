import { IFeatureFlag } from './feature-flag.interface'

export interface ILoginFeatures {
    profileActions: {
        enabled: boolean
        diagnostics: IFeatureFlag
        delete: IFeatureFlag
    }
}
