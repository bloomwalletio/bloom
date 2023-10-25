import { IFeatureFlag } from '@lib/features/interfaces'

export interface IAnalyticsFeatures extends IFeatureFlag {
    appStart: IFeatureFlag
    drawerRoute: IFeatureFlag & {
        contactBook: IFeatureFlag
        dappConfig: IFeatureFlag
        networkConfig: IFeatureFlag
    }
    dashboardRoute: IFeatureFlag & {
        collectibles: IFeatureFlag
        developer: IFeatureFlag
        governance: IFeatureFlag
        settings: IFeatureFlag
        wallet: IFeatureFlag & {
            sendFlow: IFeatureFlag
        }
    }
    loginRoute: IFeatureFlag
    onboardingRoute: IFeatureFlag
    updateStrongholdRoute: IFeatureFlag
}
