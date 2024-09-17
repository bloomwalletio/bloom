import { INetworkFeatures } from '@lib/features/interfaces'

const networkFeatures: INetworkFeatures = {
    enabled: true,
    config: {
        enabled: true,
        manageNetworks: {
            enabled: false,
            customChain: {
                enabled: false,
            },
        },
        removeNetwork: {
            enabled: false,
        },
    },
}

export default networkFeatures
