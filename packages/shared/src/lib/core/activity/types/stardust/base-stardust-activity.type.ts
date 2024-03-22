import { StardustActivityAsyncStatus } from '../../enums'
import { SmartContract } from '@core/layer-2'
import { BaseActivity } from '../base-activity.type'
import { NetworkNamespace } from '@core/network'

export type BaseStardustActivity = BaseActivity & {
    namespace: NetworkNamespace.Stardust

    outputId?: string
    tag?: string
    asyncData?: AsyncData

    // asset information
    storageDeposit?: bigint
    baseTokenTransfer: {
        rawAmount: bigint
        tokenId: string
    }
    tokenTransfer?: {
        rawAmount: bigint
        tokenId: string
    }

    // smart contract information
    // TODO: move to separate type
    smartContract?: SmartContract
    estimatedGasFee?: bigint
    maxGasFee?: bigint
    transactionFee?: bigint
}

export type AsyncData = {
    asyncStatus: StardustActivityAsyncStatus
    timelockDate?: Date
    expirationDate?: Date
    isRejected?: boolean
    isClaiming?: boolean
    claimingTransactionId?: string
    claimedDate?: Date
}
