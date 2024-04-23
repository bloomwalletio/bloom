import { Subject } from '@core/wallet'
import { ActivityAction, ActivityDirection, InclusionState } from '../enums'
import { NetworkId } from '@core/network'

export type BaseActivity = {
    // meta information
    id: string
    action: ActivityAction
    isHidden?: boolean
    isTokenHidden?: boolean // is this needed?
    isSpam?: boolean

    // transaction information
    transactionId?: string
    time: Date
    inclusionState: InclusionState
    metadata?: string

    // sender / recipient information
    sender?: Subject
    recipient?: Subject
    subject?: Subject
    isInternal: boolean
    sourceNetworkId: NetworkId
    destinationNetworkId: NetworkId
    direction: ActivityDirection
}
