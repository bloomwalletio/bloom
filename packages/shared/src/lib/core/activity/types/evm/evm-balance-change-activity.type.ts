import { EvmActivityType } from '@core/activity/enums/evm'
import { TokenStandard } from '@core/token'
import { NftStandard } from '@core/nfts'
import { NetworkId, NetworkNamespace } from '@core/network'
import { ActivityAction, ActivityDirection, InclusionState } from '@core/activity/enums'
import { Subject } from '@core/wallet/types'

export type EvmBalanceChangeActivity = {
    namespace: NetworkNamespace.Evm

    type: EvmActivityType.BalanceChange
    tokenTransfer: {
        standard: TokenStandard.Irc30 | NftStandard.Irc27
        tokenId: string
        rawAmount: bigint
    }

    // meta information
    id: string
    action: ActivityAction
    isHidden?: boolean
    isTokenHidden?: boolean // is this needed?
    containsValue?: boolean // is this needed?

    // transaction information
    time: Date
    inclusionState: InclusionState

    // sender / recipient information
    sender?: Subject
    recipient?: Subject
    subject?: Subject
    isInternal: boolean
    sourceNetworkId: NetworkId
    destinationNetworkId: NetworkId
    direction: ActivityDirection
}
