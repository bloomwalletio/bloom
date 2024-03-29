import { StardustActivityType } from '../../enums'
import { BasicOutput } from '@iota/sdk/out/types'
import { IWrappedOutput } from '../../../wallet/interfaces'
import { getActivityTypeFromOutput, getAmountFromOutput, getStorageDepositFromOutput } from '../helper'
import { getNativeTokenFromOutput, isOutputAsync } from '../outputs'

export async function activityOutputContainsValue(wrappedOutput: IWrappedOutput): Promise<boolean> {
    const type = getActivityTypeFromOutput(wrappedOutput)
    const typesToCheck = [StardustActivityType.Basic]
    if (type && typesToCheck.includes(type)) {
        const output = wrappedOutput.output as BasicOutput

        const isAsync = isOutputAsync(output)
        const nativeToken = await getNativeTokenFromOutput(output)

        const storageDeposit = getStorageDepositFromOutput(output)
        const rawAmount = getAmountFromOutput(output) - storageDeposit
        return !isAsync || rawAmount > 0 || (!!nativeToken && nativeToken.amount > 0)
    } else {
        return true
    }
}
