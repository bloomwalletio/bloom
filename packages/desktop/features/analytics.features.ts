import { IAnalyticsFeatures } from './interfaces/analytics-features.interface'

const analyticsFeatures: IAnalyticsFeatures = {
    enabled: true,
    appStart: {
        enabled: true,
    },
    drawerRoute: {
        contactBook: {
            enabled: true,
        },
        dappConfig: {
            enabled: true,
        },
        networkConfig: {
            enabled: true,
        },
    },
    dashboardRoute: {
        enabled: true,
        collectibles: {
            enabled: true,
        },
        governance: {
            enabled: true,
        },
        settings: {
            enabled: true,
        },
        wallet: {
            sendFlow: {
                enabled: true,
            },
        },
        buySell: {
            enabled: true,
        },
    },
    loginRoute: {
        enabled: true,
    },
    onboardingRoute: {
        enabled: true,
    },
    updateStrongholdRoute: {
        enabled: true,
    },
}

export default analyticsFeatures
