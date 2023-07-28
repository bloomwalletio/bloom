import { OutputParams, Assets } from '@iota/sdk/out/types/wallet'
import { convertDateToUnixTimestamp, Converter } from '@core/utils'
import { SendFlowType } from '../stores'
import { estimateGasForLayer1ToLayer2Transaction, getLayer2MetadataForTransfer } from '@core/layer-2/utils'
import { Subject, SendFlowParameters } from '@core/wallet/types'
import { ReturnStrategy } from '../enums'
import { getCoinType } from '@core/profile'
import { ILayer2Parameters } from '@core/layer-2'

export async function getOutputParameters(sendFlowParameters: SendFlowParameters): Promise<OutputParams> {
    const { recipient, expirationDate, timelockDate, giftStorageDeposit, layer2Parameters } = sendFlowParameters ?? {}

    const recipientAddress = getDestinationAddress(recipient, layer2Parameters)

    const estimatedGas = await estimateGasForLayer1ToLayer2Transaction(sendFlowParameters)

    let amount = getAmountFromTransactionData(sendFlowParameters)
    amount = layer2Parameters ? (estimatedGas + parseInt(amount, 10)).toString() : amount

    const assets = getAssetsFromTransactionData(sendFlowParameters)

    const tag = sendFlowParameters?.tag ? Converter.utf8ToHex(sendFlowParameters?.tag) : undefined

    const metadata = await getMetadata(sendFlowParameters)

    const expirationUnixTime = expirationDate ? convertDateToUnixTimestamp(expirationDate) : undefined
    const timelockUnixTime = timelockDate ? convertDateToUnixTimestamp(timelockDate) : undefined

    return <OutputParams>{
        recipientAddress,
        amount,
        ...(assets && { assets }),
        features: {
            ...(tag && { tag }),
            ...(metadata && { metadata }),
            ...(layer2Parameters && { sender: layer2Parameters.senderAddress }),
        },
        unlocks: {
            ...(expirationUnixTime && { expirationUnixTime }),
            ...(timelockUnixTime && { timelockUnixTime }),
        },
        storageDeposit: {
            returnStrategy: giftStorageDeposit ? ReturnStrategy.Gift : ReturnStrategy.Return,
        },
    }
}

function getDestinationAddress(
    recipient: Subject | undefined,
    layer2Parameters: ILayer2Parameters | undefined
): string {
    if (layer2Parameters) {
        return layer2Parameters.networkAddress
    } else if (recipient) {
        return recipient.address
    } else {
        return ''
    }
}

function getAmountFromTransactionData(sendFlowParameters: SendFlowParameters): string {
    return sendFlowParameters.baseCoinTransfer?.rawAmount ?? '0'
}

function getAssetsFromTransactionData(sendFlowParameters: SendFlowParameters): Assets | undefined {
    let assets: Assets | undefined

    if (sendFlowParameters.type === SendFlowType.NftTransfer) {
        assets = { nftId: sendFlowParameters.nft?.id }
    } else if (sendFlowParameters.type === SendFlowType.TokenTransfer) {
        const assetId = sendFlowParameters.tokenTransfer?.asset?.id
        const nativeTokenId = assetId === getCoinType() ? undefined : assetId

        if (nativeTokenId) {
            const bigAmount = BigInt(sendFlowParameters.tokenTransfer?.rawAmount ?? '0')
            assets = {
                nativeTokens: [
                    {
                        id: nativeTokenId,
                        amount: bigAmount,
                    },
                ],
            }
        }
    }

    return assets
}

function getMetadata(sendFlowParameters: SendFlowParameters): Promise<string> {
    if (sendFlowParameters.layer2Parameters) {
        return getLayer2MetadataForTransfer(sendFlowParameters)
    } else {
        return Promise.resolve(Converter.utf8ToHex(sendFlowParameters?.metadata ?? ''))
    }
}
