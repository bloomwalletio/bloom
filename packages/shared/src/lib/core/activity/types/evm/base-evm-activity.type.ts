import { NetworkNamespace } from '@core/network/enums'
import { BaseActivity } from '../base-activity.type'

export type BaseEvmActivity = BaseActivity & {
    namespace: NetworkNamespace.Evm

    tokenTransfer?: {
        rawAmount: bigint
        tokenId: string
    }
    estimatedGasFee?: bigint
    maxGasFee?: bigint
    transactionFee?: bigint
}
