import { INetworkFeatures } from '@lib/features/interfaces'

const networkFeatures: INetworkFeatures = {
    enabled: true,
    config: {
        enabled: true,
        addChain: {
            enabled: true,
            customChain: {
                enabled: false,
            },
        },
    },
}

export default networkFeatures
