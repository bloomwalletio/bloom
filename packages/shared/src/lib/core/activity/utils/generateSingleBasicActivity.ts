import { IAccountState } from '@core/account'
import { IActivityGenerationParameters } from '@core/activity/types'
import { NetworkId } from '@core/network/types'
import { BASE_TOKEN_ID } from '@core/token'
import { ActivityType } from '../enums'
import { TransactionActivity } from '../types'
import { generateBaseActivity } from './generateBaseActivity'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'

export async function generateSingleBasicActivity(
    account: IAccountState,
    networkId: NetworkId,
    generationParameters: IActivityGenerationParameters,
    overrideTokenId?: string,
    overrideAmount?: number
): Promise<TransactionActivity> {
    const baseActivity = await generateBaseActivity(account, networkId, generationParameters)

    if (baseActivity.smartContract) {
        const transferAmount = baseActivity.smartContract.baseTokens
            ? Number(baseActivity.smartContract.baseTokens ?? '0')
            : 0
        const transferDelta = baseActivity.baseTokenTransfer?.rawAmount
            ? Number(baseActivity.baseTokenTransfer.rawAmount) - transferAmount
            : 0
        baseActivity.baseTokenTransfer = {
            tokenId: BASE_TOKEN_ID,
            rawAmount: String(Math.max(transferAmount, 0)),
        }
        baseActivity.transactionFee = transferDelta
    }

    if (overrideTokenId && overrideTokenId !== BASE_TOKEN_ID && overrideAmount !== undefined) {
        const persistedToken = await getOrRequestTokenFromPersistedTokens(overrideTokenId, baseActivity.sourceNetworkId)
        baseActivity.tokenTransfer = persistedToken
            ? {
                  tokenId: overrideTokenId,
                  rawAmount: String(Math.max(overrideAmount, 0)),
              }
            : undefined
    }

    return {
        type: ActivityType.Basic,
        ...baseActivity,
    }
}
