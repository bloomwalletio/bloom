import { IAccountState } from '@core/account'
import { IActivityGenerationParameters } from '@core/activity/types'
import { SmartContract, parseLayer2Metadata } from '@core/layer-2'
import { NetworkId } from '@core/network/types'
import { isStardustNetwork } from '@core/network/utils'
import { BASE_TOKEN_ID } from '@core/token'
import { getPersistedToken } from '@core/token/stores'
import { ActivityType } from '../enums'
import { TransactionActivity } from '../types'
import { generateBaseActivity } from './generateBaseActivity'

export function generateSingleBasicActivity(
    account: IAccountState,
    networkId: NetworkId,
    generationParameters: IActivityGenerationParameters,
    overrideTokenId?: string,
    overrideAmount?: number
): TransactionActivity {
    const baseActivity = generateBaseActivity(account, networkId, generationParameters)

    const isL1toL2 =
        isStardustNetwork(baseActivity.sourceNetworkId) &&
        baseActivity.sourceNetworkId !== baseActivity.destinationNetworkId
    const smartContract: SmartContract | undefined = isL1toL2 ? parseLayer2Metadata(baseActivity.metadata) : undefined

    if (smartContract) {
        const transferAmount = smartContract.baseTokens ? Number(smartContract.baseTokens ?? 0) : 0
        const transferDelta = baseActivity.baseTokenTransfer?.rawAmount
            ? Number(baseActivity.baseTokenTransfer.rawAmount) - transferAmount
            : 0
        baseActivity.baseTokenTransfer = {
            token: { ...getPersistedToken(BASE_TOKEN_ID), networkId },
            rawAmount: String(transferAmount),
        }
        baseActivity.transactionFee = transferDelta
    }

    if (overrideTokenId && overrideTokenId !== BASE_TOKEN_ID && overrideAmount !== undefined) {
        baseActivity.tokenTransfer = {
            token: { ...getPersistedToken(overrideTokenId), networkId: baseActivity.sourceNetworkId },
            rawAmount: String(overrideAmount),
        }
    }

    return {
        type: ActivityType.Basic,
        ...baseActivity,
        smartContract,
    }
}
