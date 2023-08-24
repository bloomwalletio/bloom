import { GAS_LIMIT_MULTIPLIER, getGasPriceInWei } from '@core/layer-2'
import {
    calculateGasFeeInGlow,
    estimateGasForLayer1ToLayer2Transaction,
    getLayer2MetadataForTransfer,
} from '@core/layer-2/utils'
import { ChainConfiguration, ChainType, getActiveNetworkId, getChainConfiguration, isEvmChain } from '@core/network'
import { getCoinType } from '@core/profile/actions'
import { Converter, convertDateToUnixTimestamp } from '@core/utils'
import { SendFlowParameters, Subject } from '@core/wallet/types'
import { Assets, OutputParams } from '@iota/wallet/out/types'
import { ReturnStrategy } from '../enums'
import { SendFlowType } from '../stores'

export async function getOutputParameters(
    sendFlowParameters: SendFlowParameters,
    senderAddress?: string
): Promise<OutputParams> {
    const { recipient, expirationDate, timelockDate, giftStorageDeposit, destinationNetworkId } =
        sendFlowParameters ?? {}

    const isToLayer2 = destinationNetworkId && isEvmChain(destinationNetworkId)
    const chainConfig = isToLayer2 ? getChainConfiguration(destinationNetworkId) : undefined
    const destinationAddress = getDestinationAddress(recipient, chainConfig)

    let amount = getAmountFromTransactionData(sendFlowParameters)

    const assets = getAssetsFromTransactionData(sendFlowParameters)

    const tag = sendFlowParameters?.tag ? Converter.utf8ToHex(sendFlowParameters?.tag) : undefined

    const metadata = await getMetadata(sendFlowParameters)

    const expirationUnixTime = expirationDate ? convertDateToUnixTimestamp(expirationDate) : undefined
    const timelockUnixTime = timelockDate ? convertDateToUnixTimestamp(timelockDate) : undefined

    if (isToLayer2) {
        const estimatedGas = await estimateGasForLayer1ToLayer2Transaction(sendFlowParameters)
        const gasLimit = Math.floor(estimatedGas * GAS_LIMIT_MULTIPLIER)
        const gasPrice = await getGasPriceInWei(destinationNetworkId)
        const maxGasFee = calculateGasFeeInGlow(gasLimit, gasPrice)
        amount = (parseInt(amount, 10) + Number(maxGasFee ?? 0)).toString()
    }

    return <OutputParams>{
        recipientAddress: destinationAddress,
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
