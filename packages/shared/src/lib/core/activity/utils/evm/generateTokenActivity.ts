import { IAccountState } from '@core/account/interfaces'
import { IChain } from '@core/network'
import { BASE_TOKEN_ID } from '@core/token'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { LocalEvmTransaction } from '@core/transactions'
import { StardustActivityType } from '../../enums'
import { StardustTransactionActivity } from '../../types'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'

export async function generateTokenActivity(
    transaction: LocalEvmTransaction,
    chain: IChain,
    tokenId: string,
    rawAmount: bigint,
    baseTokenAmount: bigint | undefined,
    recipientAddress: string | undefined,
    account: IAccountState
): Promise<StardustTransactionActivity> {
    const networkId = chain.getConfiguration().id
    const baseEvmActivity = await generateBaseEvmActivity(transaction, chain, recipientAddress, account)

    let tokenTransfer
    const baseTokenTransfer = {
        tokenId: BASE_TOKEN_ID,
        rawAmount: (tokenId === BASE_TOKEN_ID ? rawAmount : baseTokenAmount) ?? BigInt(0),
    }

    if (tokenId && tokenId !== BASE_TOKEN_ID) {
        const persistedToken = await getOrRequestTokenFromPersistedTokens(tokenId, networkId)
        tokenTransfer = persistedToken
            ? {
                  tokenId: persistedToken.id,
                  rawAmount: rawAmount ?? BigInt(0),
              }
            : undefined
    }

    return {
        ...baseEvmActivity,
        type: StardustActivityType.Basic,

        // asset information
        baseTokenTransfer,
        tokenTransfer,
    }
}
