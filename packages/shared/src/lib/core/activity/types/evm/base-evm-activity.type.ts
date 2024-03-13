import { NetworkNamespace } from '@core/network/enums'
import { BaseActivity } from '../base-activity.type'

export type BaseEvmActivity = BaseActivity & {
    namespace: NetworkNamespace.Evm

    estimatedGasFee?: bigint
    maxGasFee?: bigint
    transactionFee?: bigint
}
