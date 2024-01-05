import { IAccountState } from '@core/account'
import { updateAllAccountNftsForAccount, buildNftFromNftOutput } from '@core/nfts/actions'
import { IWrappedOutput } from '@core/wallet'
import { NftOutput, OutputType } from '@iota/sdk/out/types'
import { ActivityAction, ActivityDirection } from '../enums'
import { Activity, IProcessedTransaction } from '../types'
import { generateSingleBasicActivity } from './generateSingleBasicActivity'
import { generateSingleConsolidationActivity } from './generateSingleConsolidationActivity'
import { generateSingleNftActivity } from './generateSingleNftActivity'
import { getNonRemainderBasicOutputsFromTransaction } from './getNonRemainderBasicOutputsFromTransaction'
import { getNftId } from './outputs'
import { NetworkId } from '@core/network/types'

export async function generateActivitiesFromBasicOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState,
    networkId: NetworkId
): Promise<Activity[]> {
    const activities = []

    const basicOutputs = getNonRemainderBasicOutputsFromTransaction(
        processedTransaction.outputs,
        account.depositAddress,
        processedTransaction.direction
    )
    const tokensBurned = didTokensGetBurned(
        processedTransaction.outputs,
        processedTransaction.wrappedInputs,
        processedTransaction.direction
    )
    const burnedNftInputs = getBurnedNftInputs(processedTransaction)
    for (const basicOutput of basicOutputs) {
        let activity: Activity

        const isSelfTransaction = processedTransaction.direction === ActivityDirection.SelfTransaction
        const burnedNftInputIndex = burnedNftInputs.findIndex(
            (input) => basicOutput.output && input.output?.amount === basicOutput.output.amount
        )

        let burnedNativeToken = undefined
        if (burnedNftInputIndex < 0 && tokensBurned) {
            burnedNativeToken = getBurnedNativeTokens(basicOutput, processedTransaction)
        }
        if (isSelfTransaction && burnedNftInputIndex >= 0) {
            const wrappedInput = burnedNftInputs[burnedNftInputIndex]
            const nftInput = wrappedInput.output as NftOutput
            activity = await generateSingleNftActivity(
                account,
                networkId,
                {
                    action: ActivityAction.Burn,
                    processedTransaction,
                    wrappedOutput: basicOutput,
                },
                getNftId(nftInput.nftId, wrappedInput.outputId)
            )
            const nft = buildNftFromNftOutput(wrappedInput, networkId, account.depositAddress, false)
            updateAllAccountNftsForAccount(account.index, nft)

            burnedNftInputs.splice(burnedNftInputIndex, 1)
        } else if (isSelfTransaction && burnedNativeToken) {
            activity = await generateSingleBasicActivity(
                account,
                networkId,
                {
                    action: ActivityAction.Burn,
                    processedTransaction,
                    wrappedOutput: basicOutput,
                },
                burnedNativeToken.tokenId,
                burnedNativeToken.amount
            )
        } else if (isSelfTransaction && isConsolidation(basicOutput, processedTransaction)) {
            activity = await generateSingleConsolidationActivity(account, networkId, {
                action: ActivityAction.Send,
                processedTransaction,
                wrappedOutput: basicOutput,
            })
        } else {
            activity = await generateSingleBasicActivity(account, networkId, {
                action: ActivityAction.Send,
                processedTransaction,
                wrappedOutput: basicOutput,
            })
        }
        activities.push(activity)
    }
    return activities
}

function getBurnedNftInputs(processedTransaction: IProcessedTransaction): IWrappedOutput[] {
    return processedTransaction.wrappedInputs.filter((wrappedInput) => {
        const input = wrappedInput.output
        if (!input || input.type !== OutputType.Nft) {
            return false
        }

        const nftInput = input as NftOutput
        const nftId = getNftId(nftInput.nftId, wrappedInput.outputId)

        const isIncludedInOutputs = processedTransaction.outputs.some((output) => {
            const nftOutput = output.output as NftOutput
            return nftOutput.type === OutputType.Nft ? getNftId(nftOutput.nftId, output.outputId) === nftId : false
        })

        return !isIncludedInOutputs
    })
}

function didTokensGetBurned(
    outputs: IWrappedOutput[],
    inputs: IWrappedOutput[],
    direction: ActivityDirection
): boolean {
    if (direction !== ActivityDirection.SelfTransaction) {
        return false
    }

    const inputNativeTokens: { [key: string]: number } = getAllNativeTokensFromOutputs(inputs)
    const outputNativeTokens: { [key: string]: number } = getAllNativeTokensFromOutputs(outputs)
    for (const inputNativeTokenId of Object.keys(inputNativeTokens)) {
        if (
            !outputNativeTokens[inputNativeTokenId] ||
            inputNativeTokens[inputNativeTokenId] > outputNativeTokens[inputNativeTokenId]
        ) {
            return true
        }
    }
    return false
}

function getBurnedNativeTokens(
    output: IWrappedOutput,
    processedTransaction: IProcessedTransaction
): { tokenId: string; amount: number } | undefined {
    if (processedTransaction.direction !== ActivityDirection.SelfTransaction) {
        return undefined
    }

    const inputNativeTokens: { [key: string]: number } = getAllNativeTokensFromOutputs(
        processedTransaction.wrappedInputs
    )
    const outputNativeTokens: { [key: string]: number } = getAllNativeTokensFromOutputs([output])
    for (const inputNativeTokenId of Object.keys(inputNativeTokens)) {
        if (!outputNativeTokens[inputNativeTokenId]) {
            return { tokenId: inputNativeTokenId, amount: inputNativeTokens[inputNativeTokenId] }
        }

        if (inputNativeTokens[inputNativeTokenId] > Number(outputNativeTokens[inputNativeTokenId])) {
            const burnedAmount = inputNativeTokens[inputNativeTokenId] - Number(outputNativeTokens[inputNativeTokenId])
            return { tokenId: inputNativeTokenId, amount: burnedAmount }
        }
    }
}

function getAllNativeTokensFromOutputs(outputs: IWrappedOutput[]): { [key: string]: number } {
    const nativeTokens: { [key: string]: number } = {}
    for (const output of outputs) {
        for (const nativeToken of output.output?.nativeTokens ?? []) {
            if (!nativeTokens[nativeToken.id]) {
                nativeTokens[nativeToken.id] = 0
            }
            nativeTokens[nativeToken.id] += Number(nativeToken.amount)
        }
    }
    return nativeTokens
}

function isConsolidation(output: IWrappedOutput, processedTransaction: IProcessedTransaction): boolean {
    const allBasicInputs = processedTransaction.wrappedInputs.every((input) => input.output?.type === OutputType.Basic)
    const isSelfTransaction = processedTransaction.direction === ActivityDirection.SelfTransaction
    const isSameAmount =
        processedTransaction.wrappedInputs.reduce((sum, input) => sum + Number(input.output?.amount ?? '0'), 0) ===
        Number(output.output?.amount ?? '0')

    return allBasicInputs && isSelfTransaction && isSameAmount
}
