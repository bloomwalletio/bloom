import { NetworkId, getChainConfiguration, isStardustNetwork } from '@core/network'
import { BASE_TOKEN_ID } from '@core/token'
import { generateRandomId } from '@core/utils'
import { ActivityAction, ActivityDirection, ActivityType, InclusionState } from '../../enums'
import { ITokenBalanceChange, TransactionActivity } from '../../types'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { IAccountState } from '@core/account'
import { Subject, SubjectType } from '@core/wallet'

export async function generateTokenBalanceChangeActivity(
    networkId: NetworkId,
    tokenId: string,
    balanceChange: ITokenBalanceChange,
    account: IAccountState
): Promise<TransactionActivity> {
    // Cast as a BigInt due to legacy data structures
    const difference = BigInt(balanceChange.newBalance) - BigInt(balanceChange.oldBalance ?? 0)
    const direction = difference >= 0 ? ActivityDirection.Incoming : ActivityDirection.Outgoing
    const rawAmount = direction === ActivityDirection.Incoming ? difference : difference * BigInt(-1)

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
        rawAmount: tokenId === BASE_TOKEN_ID ? rawAmount : BigInt(0),
    }

    let tokenTransfer
    if (tokenId !== BASE_TOKEN_ID) {
        const persistedTokens = await getOrRequestTokenFromPersistedTokens(tokenId, networkId)
        tokenTransfer = persistedTokens
            ? {
                  tokenId: persistedTokens.id,
                  rawAmount,
              }
            : undefined
    }

    return {
        type: ActivityType.Basic,

        // meta information
        id: generateRandomId(),
        action: balanceChange.oldBalance !== undefined ? ActivityAction.BalanceChange : ActivityAction.InitialBalance,
        containsValue: true, // TODO: check if why we do this

        // transaction information
        time: new Date(balanceChange.changedAt),
        inclusionState: InclusionState.Confirmed,

        // sender / recipient information
        sourceNetworkId: networkId,
        destinationNetworkId: networkId,
        subject: undefined,
        recipient,
        sender,
        direction,
        isInternal: false,

        // asset information
        baseTokenTransfer,
        tokenTransfer,
    }
}
