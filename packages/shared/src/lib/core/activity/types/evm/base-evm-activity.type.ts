import { BaseActivity } from '../base-activity.type'

export type BaseEvmActivity = BaseActivity & {
    baseTokenTransfer: {
        rawAmount: bigint
        tokenId: string
    }
    tokenTransfer?: {
        rawAmount: bigint
        tokenId: string
    }

    estimatedGasFee?: bigint
    maxGasFee?: bigint
    transactionFee?: bigint
}
