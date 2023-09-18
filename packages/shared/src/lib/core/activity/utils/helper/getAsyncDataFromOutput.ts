import { IAccountState } from '@core/account'
import { isActivityHiddenForAccountIndex } from '@core/activity/stores'
import { AsyncData, IClaimData } from '@core/activity/types'
import { Output } from '@core/wallet'
import { getExpirationDateFromOutput, isOutputAsync } from '../outputs'
import { getAsyncStatus } from './getAsyncStatus'
import { getStorageDepositFromOutput } from './getStorageDepositFromOutput'
import { getTimelockDateFromOutput } from './getTimelockDateFromOutput'

export function getAsyncDataFromOutput(
    output: Output,
    outputId: string,
    claimingData: IClaimData | undefined,
    account: IAccountState
): AsyncData | undefined {
    const isAsync = isOutputAsync(output)
    if (isAsync) {
        const isClaiming = false
        const claimingTransactionId = claimingData?.claimingTransactionId
        const claimedDate = claimingData?.claimedDate
        const isRejected = isActivityHiddenForAccountIndex(account.index, outputId)

        const expirationDate = getExpirationDateFromOutput(output)
        const timelockDate = getTimelockDateFromOutput(output)
        const storageDeposit = getStorageDepositFromOutput(output)

        const asyncStatus = getAsyncStatus(
            !!claimingTransactionId,
            expirationDate,
            timelockDate,
            !!storageDeposit,
            Date.now()
        )

        return {
            asyncStatus,
            timelockDate,
            expirationDate,
            isRejected,
            isClaiming,
            claimingTransactionId,
            claimedDate,
        }
    } else {
        return undefined
    }
}
