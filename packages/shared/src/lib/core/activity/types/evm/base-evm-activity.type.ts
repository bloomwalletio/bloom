import { BaseActivity } from '../base-activity.type'

export type BaseEvmActivity = BaseActivity & {
    tokenTransfer?: {
        rawAmount: bigint
        tokenId: string
    }
    estimatedGasFee?: bigint
    maxGasFee?: bigint
    transactionFee?: bigint
}
