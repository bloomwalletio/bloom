import { IFeatureFlag } from '@lib/features/interfaces'

const buySellFeatures: IFeatureFlag = {
    enabled: true,
    sell: {
        enabled: false,
    },
}

export default buySellFeatures
