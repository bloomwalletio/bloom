import { IAccountState } from '@core/account'
import { IActivityGenerationParameters } from '@core/activity/types'
import { NetworkId } from '@core/network/types'
import { BASE_TOKEN_ID } from '@core/token'
import { StardustActivityType } from '../../enums'
import { StardustTransactionActivity } from '../../types'
import { generateBaseActivity } from './generateBaseActivity'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'

export async function generateSingleBasicActivity(
    account: IAccountState,
    networkId: NetworkId,
    generationParameters: IActivityGenerationParameters,
    overrideTokenId?: string,
    overrideAmount?: bigint
): Promise<StardustTransactionActivity> {
    const baseActivity = await generateBaseActivity(account, networkId, generationParameters)

    if (baseActivity.smartContract) {
        const transferAmount = BigInt(baseActivity.smartContract.baseTokens ?? 0)
        const transferDelta = baseActivity.baseTokenTransfer?.rawAmount
            ? baseActivity.baseTokenTransfer.rawAmount - transferAmount
            : BigInt(0)
        baseActivity.baseTokenTransfer = {
            tokenId: BASE_TOKEN_ID,
            rawAmount: transferAmount < 0 ? BigInt(0) : transferAmount,
        }
        baseActivity.transactionFee = transferDelta
    }

    if (overrideTokenId && overrideTokenId !== BASE_TOKEN_ID && overrideAmount !== undefined) {
        const persistedToken = await getOrRequestTokenFromPersistedTokens(overrideTokenId, baseActivity.sourceNetworkId)
        baseActivity.tokenTransfer = persistedToken
            ? {
                  tokenId: overrideTokenId,
                  rawAmount: overrideAmount < 0 ? BigInt(0) : overrideAmount,
              }
            : undefined
    }

    return {
        type: StardustActivityType.Basic,
        ...baseActivity,
    }
}
