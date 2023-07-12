import { OutputParams, Assets } from '@iota/wallet/out/types'
import { convertDateToUnixTimestamp, Converter } from '@core/utils'
import { NewTransactionType } from '../stores'
import { getEstimatedGasForTransferFromTransactionData, getLayer2MetadataForTransfer } from '@core/layer-2/utils'
import { Subject, TransactionData } from '@core/wallet/types'
import { getAddressFromSubject } from '@core/wallet/utils'
import { ReturnStrategy } from '../enums'
import { getCoinType } from '@core/profile'
import { ILayer2Parameters } from '@core/layer-2'

export async function getOutputParameters(transactionData: TransactionData): Promise<OutputParams> {
    const { recipient, expirationDate, timelockDate, giftStorageDeposit, layer2Parameters } = transactionData ?? {}

    const recipientAddress = getDestinationAddress(recipient, layer2Parameters)

    const estimatedGas = await getEstimatedGasForTransferFromTransactionData(transactionData)

    let amount = getAmountFromTransactionData(transactionData)
    amount = layer2Parameters ? (estimatedGas + parseInt(amount, 10)).toString() : amount

    const assets = getAssetFromTransactionData(transactionData)

    const tag = transactionData?.tag ? Converter.utf8ToHex(transactionData?.tag) : undefined

    const metadata = await getMetadata(transactionData)

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
        return getAddressFromSubject(recipient)
    } else {
        return ''
    }
}

function getAmountFromTransactionData(transactionData: TransactionData): string {
    let rawAmount: string
    if (transactionData.type === NewTransactionType.TokenTransfer) {
        const asset = transactionData.asset

        const nativeTokenId = asset?.id === getCoinType() ? undefined : asset?.id

        if (nativeTokenId) {
            rawAmount = transactionData?.surplus ?? '0'
        } else {
            rawAmount = BigInt(transactionData.rawAmount).toString()
        }
    } else if (transactionData.type === NewTransactionType.NftTransfer) {
        rawAmount = transactionData?.surplus ?? '0'
    } else {
        rawAmount = '0'
    }
    return rawAmount
}

function getAssetFromTransactionData(transactionData: TransactionData): Assets | undefined {
    let assets: Assets | undefined

    if (transactionData.type === NewTransactionType.NftTransfer) {
        assets = { nftId: transactionData.nft?.id }
    } else if (transactionData.type === NewTransactionType.TokenTransfer) {
        const assetId = transactionData.asset?.id

        const nativeTokenId = assetId === getCoinType() ? undefined : assetId

        if (nativeTokenId) {
            const bigAmount = BigInt(transactionData.rawAmount)
            assets = {
                nativeTokens: [
                    {
                        id: nativeTokenId,
                        amount: Converter.bigIntToHex(bigAmount),
                    },
                ],
            }

            // If it's a base coin transaction, we don't need to specify assets
        } else {
            assets = undefined
        }
    } else {
        throw new Error('Invalid transaction type')
    }

    return assets
}

function getMetadata(transactionData: TransactionData): Promise<string> {
    if (transactionData.layer2Parameters) {
        return getLayer2MetadataForTransfer(transactionData)
    } else {
        return Promise.resolve(Converter.utf8ToHex(transactionData?.metadata ?? ''))
    }
}
