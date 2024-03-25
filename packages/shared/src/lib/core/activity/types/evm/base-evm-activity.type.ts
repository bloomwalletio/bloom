import { NetworkNamespace } from '@core/network/enums'
import { BaseActivity } from '../base-activity.type'

export type BaseEvmActivity = BaseActivity & {
    namespace: NetworkNamespace.Evm

    contractAddress?: string
    estimatedGasFee?: bigint
    maxGasFee?: bigint
    transactionFee?: bigint
}
