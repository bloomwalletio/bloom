import { IAccountState } from '@core/account'
import { EvmActivityType } from '@core/activity/enums/evm'
import { EvmNetworkId, NetworkNamespace, getEvmNetwork } from '@core/network'
import { TokenStandard } from '@core/token'
import { generateRandomId } from '@core/utils'
import { Subject, SubjectType } from '@core/wallet'
import { ActivityAction, ActivityDirection, InclusionState } from '../../enums'
import { EvmBalanceChangeActivity } from '../../types'
import { NftStandard } from '@core/nfts'

export function generateEvmBalanceChangeActivity(
    {
        rawAmount,
        tokenId,
        direction,
        time,
        standard,
    }: {
        standard: TokenStandard.Irc30 | NftStandard.Irc27
        rawAmount: bigint
        tokenId: string
        direction: ActivityDirection
        time: Date
    },
    networkId: EvmNetworkId,
    account: IAccountState
): EvmBalanceChangeActivity {
    const coinType = getEvmNetwork(networkId)?.coinType
    const evmAddress = coinType !== undefined ? account.evmAddresses[coinType] : undefined
    const accountSubject: Subject | undefined = evmAddress
        ? { type: SubjectType.Account, account, address: evmAddress }
        : undefined

    const isIncoming = direction === ActivityDirection.Incoming
    const recipient = isIncoming ? accountSubject : undefined
    const sender = isIncoming ? undefined : accountSubject

    return {
        namespace: NetworkNamespace.Evm,
        type: EvmActivityType.BalanceChange,
        tokenTransfer: {
            standard,
            rawAmount,
            tokenId,
        },

        // meta information
        id: generateRandomId(),
        action: ActivityAction.Send,
        isSpam: false,

        // transaction information
        time,
        inclusionState: InclusionState.Confirmed,

        // sender / recipient information
        sourceNetworkId: networkId,
        destinationNetworkId: networkId,
        subject: isIncoming ? sender : recipient,
        recipient,
        sender,
        direction,
        isInternal: false,
    }
}
