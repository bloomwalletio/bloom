import type { OutputData, BasicOutput } from '@iota/sdk'

import { OUTPUT_TYPE_BASIC } from '@core/wallet'

export function filterBasicOutput(outputData: OutputData): boolean {
    return outputData?.output?.type === OUTPUT_TYPE_BASIC
}

export function filterShimmerClaimingOutputs(outputData: OutputData): boolean {
    const output = outputData?.output as BasicOutput

    const isBasicOutput = filterBasicOutput(outputData)
    const hasOneUnlockCondition = output?.unlockConditions?.length === 1
    const hasNoNativeTokens = !output?.nativeTokens || output?.nativeTokens?.length === 0

    return isBasicOutput && hasOneUnlockCondition && hasNoNativeTokens
}
