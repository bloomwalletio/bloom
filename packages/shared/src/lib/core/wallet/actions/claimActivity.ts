import { handleError } from '@core/error/handlers'
import {
    isActivityHiddenForAccountIndex,
    removeActivityFromHiddenActivities,
    updateAsyncDataByActivityId,
} from '@core/activity/stores'
import { StardustActivity } from '@core/activity/types'
import { IAccountState } from '@core/account'
import { setSendFlowParameters } from '../stores'
import { isActiveLedgerProfile } from '@core/profile/stores'
import { get } from 'svelte/store'
import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
import { SendFlowType } from '../enums'
import { BaseSendFlowParameters } from '../types'
import { checkActiveProfileAuth } from '@core/profile/actions'

export async function claimActivity(activity: StardustActivity, account: IAccountState | undefined): Promise<void> {
    if (!activity.outputId || !account) {
        return
    }

    try {
        await checkActiveProfileAuth()
    } catch {
        return
    }

    try {
        if (isActivityHiddenForAccountIndex(account.index, activity.id)) {
            removeActivityFromHiddenActivities(account.index, activity.id)
            updateAsyncDataByActivityId(account.index, activity.id, { isRejected: false })
        }

        updateAsyncDataByActivityId(account.index, activity.id, { isClaiming: true })

        // Native token transfers use blind signing which doesn't require setting claim parameters
        if (get(isActiveLedgerProfile) && activity.baseTokenTransfer) {
            setSendParametersForClaiming(activity)
        }

        const result = await account.claimOutputs([activity.outputId])
        const transactionId = result.transactionId
        updateAsyncDataByActivityId(account.index, activity.id, { claimingTransactionId: transactionId })
    } catch (err) {
        handleError(err)
        updateAsyncDataByActivityId(account.index, activity.id, { isClaiming: false })
    }
}

function setSendParametersForClaiming(activity: StardustActivity): void {
    const token = getTokenFromSelectedAccountTokens(activity.baseTokenTransfer.tokenId, activity.destinationNetworkId)
    if (!token) {
        return
    }

    const params: BaseSendFlowParameters = { type: SendFlowType.BaseCoinTransfer }
    if (activity?.storageDeposit) {
        // If SDRUC requires a transaction to the sender
        params.recipient = activity.sender
        params.baseCoinTransfer = {
            rawAmount: activity.storageDeposit,
            token,
        }
    } else {
        // If an expiration unlock condition requires the consumption of a transaction
        params.recipient = activity.recipient
        params.baseCoinTransfer = {
            rawAmount: activity.baseTokenTransfer.rawAmount,
            token,
        }
    }
    params.sourceNetworkId = token.networkId
    setSendFlowParameters(params)
}
