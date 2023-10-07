import { IFeatureFlag } from './feature-flag.interface'

export interface ILoginFeatures {
    selectProfile: {
        autoSelect: IFeatureFlag
        createNewProfile: IFeatureFlag
        profileActions: IFeatureFlag & {
            edit: IFeatureFlag
            remove: IFeatureFlag
            viewInFiles: IFeatureFlag
        }
    }
    login: {
        errorCooldown: IFeatureFlag
    }
    settings: IFeatureFlag
    help: IFeatureFlag
}
