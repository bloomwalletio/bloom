import { NetworkId, getChainConfiguration, isStardustNetwork } from '@core/network'
import { BASE_TOKEN_ID } from '@core/token'
import { generateRandomId } from '@core/utils'
import { ActivityAction, ActivityDirection, StardustActivityType, InclusionState } from '../../enums'
import { INftBalanceChange, StardustNftActivity } from '../../types'
import { IAccountState } from '@core/account'
import { Subject, SubjectType } from '@core/wallet'

export function generateNftBalanceChangeActivity(
    networkId: NetworkId,
    nftId: string,
    balanceChange: INftBalanceChange,
    account: IAccountState
): StardustNftActivity {
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
        type: StardustActivityType.Nft,

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
