import { NftOutput } from '@iota/sdk/out/types'
import { getTimelockDateFromOutput } from '@core/activity/utils'
import {
    getExpirationUnixTimeFromOutput,
    getRecipientAddressFromOutput,
    isOutputAsync,
} from '@core/activity/utils/outputs'

export function getSpendableStatusFromUnspentNftOutput(
    accountAddress: string,
    nftOutput: NftOutput
): { isSpendable: boolean; timeLockTime: number | undefined } {
    let isSpendable = true
    let timeLockTime: number | undefined

    const isAsync = isOutputAsync(nftOutput)
    if (isAsync) {
        const expirationUnixTime = getExpirationUnixTimeFromOutput(nftOutput)
        const timeLockUnixTime = getTimelockDateFromOutput(nftOutput)?.getTime()
        const isRecipient = getRecipientAddressFromOutput(nftOutput) === accountAddress

        if (expirationUnixTime) {
            if (isRecipient) {
                isSpendable = expirationUnixTime >= Date.now()
            } else {
                isSpendable = expirationUnixTime < Date.now()
            }
        }

        if (isRecipient && timeLockUnixTime) {
            timeLockTime = timeLockUnixTime
        }
    }
    return { isSpendable, timeLockTime }
}
