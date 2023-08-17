import { NftOutput, UnlockConditionType } from '@iota/sdk/out/types'
import { getTimelockDateFromOutput } from '@core/activity/utils'
import {
    getExpirationUnixTimeFromOutput,
    getRecipientAddressFromOutput,
    isOutputAsync,
} from '@core/activity/utils/outputs'

export function getSpendableStatusFromUnspentNftOutput(
    accountAddress: string,
    nftOutput: NftOutput
): { isSpendable: boolean; timeLockTime: string } {
    let isSpendable = true
    let timeLockTime = undefined

    const isAsync = isOutputAsync(nftOutput)
    if (isAsync) {
        const expirationUnixTime = getExpirationUnixTimeFromOutput(nftOutput)
        const timeLockUnixTime = getTimelockDateFromOutput(nftOutput)?.getTime()
        const isRecipient = getRecipientAddressFromOutput(nftOutput) === accountAddress
        const hasStorageDepositReturnUnlockCondition = nftOutput.unlockConditions.some(
            (unlockCondition) => unlockCondition?.type === UnlockConditionType.StorageDepositReturn
        )
        if (expirationUnixTime) {
            if (isRecipient) {
                isSpendable = false
            } else {
                isSpendable = expirationUnixTime < Date.now()
            }
        } else if (hasStorageDepositReturnUnlockCondition) {
            isSpendable = false
        }

        if (isRecipient && timeLockUnixTime) {
            timeLockTime = timeLockUnixTime
        }
    }
    return { isSpendable, timeLockTime }
}
