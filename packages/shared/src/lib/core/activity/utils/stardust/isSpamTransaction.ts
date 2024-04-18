import { StardustActivityType } from '../../enums'
import { BasicOutput } from '@iota/sdk/out/types'
import { IWrappedOutput } from '../../../wallet/interfaces'
import {
    getActivityTypeFromOutput,
    getAmountFromOutput,
    getStorageDepositFromOutput,
    getTimelockDateFromOutput,
} from '../helper'
import { getExpirationDateFromOutput, getNativeTokenFromOutput, isOutputAsync } from '../outputs'
import { IProcessedTransaction } from '@core/activity/types'

export async function isSpamTransaction(
    wrappedOutput: IWrappedOutput,
    processedTransaction: IProcessedTransaction
): Promise<boolean> {
    const type = getActivityTypeFromOutput(wrappedOutput)
    if (type === StardustActivityType.Basic || type === StardustActivityType.Nft) {
        const output = wrappedOutput.output as BasicOutput

        const onlyContainsStorageDepositResult = await onlyContainsStorageDeposit(output, type)
        if (onlyContainsStorageDepositResult) {
            return true
        }

        const hasInvalidExpirationDateResult = hasInvalidExpirationDate(output, processedTransaction.time)
        if (hasInvalidExpirationDateResult) {
            return true
        }

        return false
    } else {
        return false
    }
}

async function onlyContainsStorageDeposit(output: BasicOutput, type: StardustActivityType): Promise<boolean> {
    if (type === StardustActivityType.Nft) {
        return false
    }

    const isAsync = isOutputAsync(output)
    const nativeToken = await getNativeTokenFromOutput(output)

    const storageDeposit = getStorageDepositFromOutput(output)
    const rawAmount = getAmountFromOutput(output) - storageDeposit
    return isAsync && rawAmount === BigInt(0) && (!nativeToken || nativeToken.amount === BigInt(0))
}

function hasInvalidExpirationDate(output: BasicOutput, transactionTime: Date): boolean {
    const expirationTime = getExpirationDateFromOutput(output)
    if (!expirationTime) {
        return false
    }

    const timelockDateTime = getTimelockDateFromOutput(output)
    if (timelockDateTime) {
        return expirationTime.getTime() < timelockDateTime.getTime()
    }
    return expirationTime.getTime() < transactionTime.getTime()
}
