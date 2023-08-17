import { ActivityType } from '../enums'
import { BasicOutput } from '@iota/sdk/out/types'
import { IWrappedOutput } from '../../wallet/interfaces'
import { getActivityTypeFromOutput, getAmountFromOutput, getStorageDepositFromOutput } from './helper'
import { getNativeTokenFromOutput, isOutputAsync } from './outputs'

export function activityOutputContainsValue(wrappedOutput: IWrappedOutput): boolean {
    const type = getActivityTypeFromOutput(wrappedOutput)
    const typesToCheck = [ActivityType.Basic]
    if (typesToCheck.includes(type)) {
        const output = wrappedOutput.output as BasicOutput

        const isAsync = isOutputAsync(output)
        const nativeToken = getNativeTokenFromOutput(output)

        const storageDeposit = getStorageDepositFromOutput(output)
        const rawAmount = getAmountFromOutput(output) - storageDeposit
        return !isAsync || rawAmount > 0 || (!!nativeToken && Number(nativeToken.amount) > 0)
    } else {
        return true
    }
}
