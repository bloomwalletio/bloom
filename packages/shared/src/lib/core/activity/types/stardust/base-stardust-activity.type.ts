import { Subject } from '@core/wallet/types'
import { StardustActivityAsyncStatus, ActivityDirection, InclusionState, ActivityAction } from '../../enums'
import { SmartContract } from '@core/layer-2'
import { NetworkId } from '@core/network'

export type BaseStardustActivity = {
    // meta information
    id: string
    action: ActivityAction
    isHidden?: boolean
    isTokenHidden?: boolean // is this needed?
    containsValue?: boolean // is this needed?

    // transaction information
    transactionId?: string
    outputId?: string
    time: Date
    inclusionState: InclusionState
    tag?: string
    metadata?: string
    asyncData?: AsyncData

    // sender / recipient information
    sender?: Subject | undefined
    recipient?: Subject | undefined
    subject: Subject | undefined
    isInternal: boolean
    sourceNetworkId: NetworkId
    destinationNetworkId: NetworkId
    direction: ActivityDirection

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
