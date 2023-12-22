import { OutputParams, Assets } from '@iota/sdk/out/types'
import { getLayer2MetadataForTransfer } from '@core/layer-2/actions'
import { ChainConfiguration, ChainType, getChainConfiguration, isEvmChain } from '@core/network'
import { BASE_TOKEN_ID } from '@core/token'
import { Converter, convertDateToUnixTimestamp } from '@core/utils'
import { SendFlowParameters, Subject } from '@core/wallet/types'
import { ReturnStrategy, SendFlowType } from '../enums'

export function getOutputParameters(sendFlowParameters: SendFlowParameters, senderAddress?: string): OutputParams {
    const { recipient, expirationDate, timelockDate, giftStorageDeposit, destinationNetworkId } =
        sendFlowParameters ?? {}

    const isToLayer2 = destinationNetworkId && isEvmChain(destinationNetworkId)
    if (isToLayer2 && !senderAddress) {
        throw new Error('Sender address must be defined if sending to Layer 2')
    }

    const chainConfig = isToLayer2 ? getChainConfiguration(destinationNetworkId) : undefined
    const destinationAddress = getDestinationAddress(recipient, chainConfig)

    const amount = getAmountFromTransactionData(sendFlowParameters)
    const assets = getAssetsFromTransactionData(sendFlowParameters)

    const tag = sendFlowParameters?.tag ? Converter.utf8ToHex(sendFlowParameters?.tag) : undefined

    const expirationUnixTime = expirationDate ? convertDateToUnixTimestamp(expirationDate) : undefined
    const timelockUnixTime = timelockDate ? convertDateToUnixTimestamp(timelockDate) : undefined

    const metadata = isToLayer2
        ? getLayer2MetadataForTransfer(sendFlowParameters)
        : Converter.utf8ToHex(sendFlowParameters?.metadata ?? '')

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
            returnStrategy: giftStorageDeposit || isToLayer2 ? ReturnStrategy.Gift : ReturnStrategy.Return,
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

function getAmountFromTransactionData(sendFlowParameters: SendFlowParameters): bigint {
    return sendFlowParameters.baseCoinTransfer?.rawAmount ?? BigInt('0')
}

function getAssetsFromTransactionData(sendFlowParameters: SendFlowParameters): Assets | undefined {
    let assets: Assets | undefined

    if (sendFlowParameters.type === SendFlowType.NftTransfer) {
        assets = { nftId: sendFlowParameters.nft?.id }
    } else if (sendFlowParameters.type === SendFlowType.TokenTransfer) {
        const tokenId = sendFlowParameters.tokenTransfer?.token?.id
        const nativeTokenId = tokenId === BASE_TOKEN_ID ? undefined : tokenId

        if (nativeTokenId) {
            const bigAmount = sendFlowParameters.tokenTransfer?.rawAmount ?? BigInt(0)
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
