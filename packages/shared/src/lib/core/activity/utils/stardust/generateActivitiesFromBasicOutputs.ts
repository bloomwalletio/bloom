import { IAccountState } from '@core/account'
import { buildNftFromNftOutput, persistAndUpdateCollections } from '@core/nfts/actions'
import { IWrappedOutput } from '@core/wallet'
import { NftOutput, OutputType } from '@iota/sdk/out/types'
import { ActivityAction, ActivityDirection } from '../../enums'
import { StardustActivity, IProcessedTransaction } from '../../types'
import { generateSingleBasicActivity } from './generateSingleBasicActivity'
import { generateSingleConsolidationActivity } from './generateSingleConsolidationActivity'
import { generateSingleNftActivity } from './generateSingleNftActivity'
import { getNonRemainderBasicOutputsFromTransaction } from './getNonRemainderBasicOutputsFromTransaction'
import { getNftId } from '../outputs'
import { StardustNetworkId } from '@core/network/types'
import { addOrUpdateNftForAccount } from '@core/nfts/stores'

export async function generateActivitiesFromBasicOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState,
    networkId: StardustNetworkId
): Promise<StardustActivity[]> {
    const activities: StardustActivity[] = []

    const basicOutputs = getNonRemainderBasicOutputsFromTransaction(
        processedTransaction.outputs,
        account,
        processedTransaction.direction
    )
    const tokensBurned = didTokensGetBurned(
        processedTransaction.outputs,
        processedTransaction.wrappedInputs,
        processedTransaction.direction
    )
    const burnedNftInputs = getBurnedNftInputs(processedTransaction)
    for (const basicOutput of basicOutputs) {
        try {
            let activity: StardustActivity

            const isSelfTransaction = processedTransaction.direction === ActivityDirection.SelfTransaction
            const burnedNftInputIndex = burnedNftInputs.findIndex(
                (input) => basicOutput.output && input.output?.amount === basicOutput.output.amount
            )

            let burnedNativeToken: { tokenId: string; amount: bigint } | undefined
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
                addOrUpdateNftForAccount(account.index, nft)
                await persistAndUpdateCollections(account.index, [nft])

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
        } catch (error) {
            console.error(error)
        }
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

    const inputNativeTokens: { [key: string]: bigint } = getAllNativeTokensFromOutputs(inputs)
    const outputNativeTokens: { [key: string]: bigint } = getAllNativeTokensFromOutputs(outputs)
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
): { tokenId: string; amount: bigint } | undefined {
    if (processedTransaction.direction !== ActivityDirection.SelfTransaction) {
        return undefined
    }

    const inputNativeTokens: { [key: string]: bigint } = getAllNativeTokensFromOutputs(
        processedTransaction.wrappedInputs
    )
    const outputNativeTokens: { [key: string]: bigint } = getAllNativeTokensFromOutputs([output])
    for (const inputNativeTokenId of Object.keys(inputNativeTokens)) {
        const inputAmount = inputNativeTokens[inputNativeTokenId]
        const outputAmount = outputNativeTokens[inputNativeTokenId]
        if (!outputAmount) {
            return { tokenId: inputNativeTokenId, amount: inputAmount }
        }

        if (inputAmount > outputAmount) {
            const burnedAmount = inputAmount - outputAmount
            return { tokenId: inputNativeTokenId, amount: burnedAmount }
        }
    }
}

function getAllNativeTokensFromOutputs(outputs: IWrappedOutput[]): { [key: string]: bigint } {
    const nativeTokens: { [key: string]: bigint } = {}
    for (const output of outputs) {
        for (const nativeToken of output.output?.nativeTokens ?? []) {
            if (!nativeTokens[nativeToken.id]) {
                nativeTokens[nativeToken.id] = BigInt(0)
            }
            nativeTokens[nativeToken.id] += BigInt(nativeToken.amount)
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
