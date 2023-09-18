import { IFeatureFlag } from './feature-flag.interface'

export interface ILoginFeatures {
    profileActions: IFeatureFlag & {
        edit: IFeatureFlag
        remove: IFeatureFlag
        viewInFiles: IFeatureFlag
    }
}
