import { IFeatureFlag } from './feature-flag.interface'

export interface ILoginFeatures {
    profileActions: {
        enabled: boolean
        edit: IFeatureFlag
        remove: IFeatureFlag
        viewInFiles: IFeatureFlag
    }
}
