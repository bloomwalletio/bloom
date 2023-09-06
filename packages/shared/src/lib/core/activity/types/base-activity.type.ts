import { Subject } from '@core/wallet/types'
import { ActivityAsyncStatus, ActivityDirection, InclusionState, ActivityAction } from '../enums'
import { SmartContract } from '@core/layer-2'
import { NetworkId } from '@core/network'

export type BaseActivity = {
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
    storageDeposit?: number
    baseTokenTransfer: {
        rawAmount: string
        tokenId: string
    }
    tokenTransfer?: {
        rawAmount: string
        tokenId: string
    }

    // smart contract information
    // TODO: move to separate type
    smartContract?: SmartContract
    estimatedGasFee?: number
    maxGasFee?: number
    transactionFee?: number
}

export type AsyncData = {
    asyncStatus: ActivityAsyncStatus
    timelockDate: Date
    expirationDate: Date
    isRejected: boolean
    isClaiming: boolean
    claimingTransactionId?: string
    claimedDate?: Date
}
