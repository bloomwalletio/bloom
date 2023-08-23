import { estimateGasForLayer1ToLayer2Transaction, getLayer2MetadataForTransfer } from '@core/layer-2/utils'
import { getCoinType } from '@core/profile/actions'
import { Converter, convertDateToUnixTimestamp } from '@core/utils'
import { SendFlowParameters, Subject } from '@core/wallet/types'
import { Assets, OutputParams } from '@iota/wallet/out/types'
import { ReturnStrategy } from '../enums'
import { SendFlowType } from '../stores'
import { ChainConfiguration, ChainType, getActiveNetworkId, getChainConfiguration, isEvmChain } from '@core/network'

export async function getOutputParameters(
    sendFlowParameters: SendFlowParameters,
    senderAddress?: string
): Promise<OutputParams> {
    const { recipient, expirationDate, timelockDate, giftStorageDeposit, destinationNetworkId } =
        sendFlowParameters ?? {}

    const isToLayer2 = destinationNetworkId && isEvmChain(destinationNetworkId)
    const chainConfig = isToLayer2 ? getChainConfiguration(destinationNetworkId) : undefined
    const recipientAddress = getDestinationAddress(recipient, chainConfig)

    const estimatedGas = await estimateGasForLayer1ToLayer2Transaction(sendFlowParameters)

    let amount = getAmountFromTransactionData(sendFlowParameters)
    amount = isToLayer2 ? (estimatedGas + parseInt(amount, 10)).toString() : amount

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
            ...(isToLayer2 && senderAddress && { sender: senderAddress }),
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

function getDestinationAddress(recipient: Subject | undefined, chainConfig: ChainConfiguration | undefined): string {
    if (chainConfig?.type === ChainType.Iscp) {
        return chainConfig.aliasAddress
    }
    if (recipient) {
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
        const tokenId = sendFlowParameters.tokenTransfer?.token?.id
        const nativeTokenId = tokenId === getCoinType() ? undefined : tokenId

        if (nativeTokenId) {
            const bigAmount = BigInt(sendFlowParameters.tokenTransfer?.rawAmount ?? '0')
            assets = {
                nativeTokens: [
                    {
                        id: nativeTokenId,
                        amount: Converter.bigIntToHex(bigAmount),
                    },
                ],
            }
        }
    }

    return assets
}

function getMetadata(sendFlowParameters: SendFlowParameters): Promise<string> {
    if (sendFlowParameters.destinationNetworkId !== getActiveNetworkId()) {
        return getLayer2MetadataForTransfer(sendFlowParameters)
    } else {
        return Promise.resolve(Converter.utf8ToHex(sendFlowParameters?.metadata ?? ''))
    }
}
