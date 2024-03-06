import { IAccountState } from '@core/account'
import { EvmActivityType } from '@core/activity/enums/evm'
import { NetworkId, NetworkNamespace, getChainConfiguration, isStardustNetwork } from '@core/network'
import { BASE_TOKEN_ID } from '@core/token'
import { generateRandomId } from '@core/utils'
import { Subject, SubjectType } from '@core/wallet'
import { ActivityAction, ActivityDirection, InclusionState } from '../../enums'
import { EvmActivity, INftBalanceChange } from '../../types'

export function generateNftBalanceChangeActivity(
    networkId: NetworkId,
    nftId: string,
    balanceChange: INftBalanceChange,
    account: IAccountState
): EvmActivity {
    const direction = balanceChange.owned ? ActivityDirection.Incoming : ActivityDirection.Outgoing

    let accountSubject: Subject | undefined
    if (isStardustNetwork(networkId)) {
        accountSubject = { type: SubjectType.Account, account, address: account.depositAddress }
    } else {
        const coinType = getChainConfiguration(networkId)?.coinType
        const evmAddress = coinType !== undefined ? account.evmAddresses[coinType] : undefined
        accountSubject = evmAddress ? { type: SubjectType.Account, account, address: evmAddress } : undefined
    }

    const recipient = direction === ActivityDirection.Incoming ? accountSubject : undefined
    const sender = direction === ActivityDirection.Incoming ? undefined : accountSubject

    const baseTokenTransfer = {
        tokenId: BASE_TOKEN_ID,
        rawAmount: BigInt(0),
    }

    return {
        namespace: NetworkNamespace.Evm,
        type: EvmActivityType.TokenTransfer,

        // meta information
        id: generateRandomId(),
        action: ActivityAction.Send,
        containsValue: true, // TODO: check if why we do this

        // transaction information
        time: new Date(balanceChange.changedAt),
        inclusionState: InclusionState.Confirmed,

        // sender / recipient information
        sourceNetworkId: networkId,
        destinationNetworkId: networkId,
        subject: balanceChange.owned ? sender : recipient,
        recipient,
        sender,
        direction,
        isInternal: false,

        // asset information
        baseTokenTransfer,
        nftId,
    }
}
