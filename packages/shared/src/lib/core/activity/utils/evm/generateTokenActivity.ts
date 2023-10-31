import { NetworkId } from '@core/network/types'
import { BASE_TOKEN_ID } from '@core/token'
import { ActivityType } from '../../enums'
import { PersistedEvmTransaction, TransactionActivity } from '../../types'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { IChain } from '@core/network'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'
import { IAccountState } from '@core/account/interfaces'

export async function generateTokenActivity(
    transaction: PersistedEvmTransaction,
    networkId: NetworkId,
    chain: IChain,
    tokenId: string,
    rawAmount: string,
    recipientAddress: string | undefined,
    account: IAccountState
): Promise<TransactionActivity> {
    const baseEvmActivity = await generateBaseEvmActivity(transaction, networkId, chain, recipientAddress, account)

    let tokenTransfer
    const baseTokenTransfer = {
        tokenId: BASE_TOKEN_ID,
        rawAmount: tokenId === BASE_TOKEN_ID ? rawAmount ?? '0' : '0',
    }

    if (tokenId && tokenId !== BASE_TOKEN_ID) {
        const persistedToken = await getOrRequestTokenFromPersistedTokens(tokenId, networkId)
        tokenTransfer = persistedToken
            ? {
                  tokenId: persistedToken.id,
                  rawAmount: rawAmount ?? '0',
              }
            : undefined
    }

    return {
        ...baseEvmActivity,
        type: ActivityType.Basic,

        // asset information
        baseTokenTransfer,
        tokenTransfer,
    }
}
