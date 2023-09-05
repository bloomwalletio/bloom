import { NetworkId } from '@core/network'
import { BASE_TOKEN_ID } from '@core/token'
import { getPersistedToken } from '@core/token/stores'
import { generateRandomId } from '@core/utils'
import { TokenTransferData } from '@core/wallet'
import { ActivityAction, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { ITokenBalanceChange, TransactionActivity } from '../types'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'

export async function generateBalanceChangeActivity(
    networkId: NetworkId,
    tokenId: string,
    balanceChange: ITokenBalanceChange
): Promise<TransactionActivity> {
    const difference = balanceChange.newBalance - (balanceChange.oldBalance ?? 0)
    const direction = difference >= 0 ? ActivityDirection.Incoming : ActivityDirection.Outgoing

    const baseTokenTransfer: TokenTransferData | undefined = {
        token: { ...getPersistedToken(BASE_TOKEN_ID), networkId },
        rawAmount: tokenId !== BASE_TOKEN_ID ? String(Math.abs(difference)) : '0',
    }

    let tokenTransfer: TokenTransferData | undefined
    if (tokenId !== BASE_TOKEN_ID) {
        const persistedTokens = await getOrRequestTokenFromPersistedTokens(tokenId, networkId)
        tokenTransfer = persistedTokens
            ? {
                  token: { ...persistedTokens, networkId },
                  rawAmount: String(Math.abs(difference)),
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
        direction,
        isInternal: false,

        // asset information
        baseTokenTransfer,
        tokenTransfer,
    }
}
