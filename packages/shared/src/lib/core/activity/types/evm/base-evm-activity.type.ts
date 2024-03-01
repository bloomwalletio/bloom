import { Subject } from '@core/wallet/types'
import { ActivityDirection, InclusionState, ActivityAction } from '../../enums'
import { NetworkId } from '@core/network'

export type BaseEvmActivity = {
    // meta information
    id: string
    action: ActivityAction
    isHidden?: boolean
    isTokenHidden?: boolean // is this needed?
    containsValue?: boolean // is this needed?

    // transaction information
    transactionId?: string
    time: Date
    inclusionState: InclusionState
    metadata?: string

    // sender / recipient information
    sender?: Subject | undefined
    recipient?: Subject | undefined
    subject: Subject | undefined
    isInternal: boolean
    sourceNetworkId: NetworkId
    destinationNetworkId: NetworkId
    direction: ActivityDirection

    // smart contract information
    // TODO: move to separate type
    estimatedGasFee?: bigint
    maxGasFee?: bigint
    transactionFee?: bigint
}
