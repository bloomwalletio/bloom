import { getNetwork } from '@core/network'
import { IAsset } from '../../interfaces'
import { NewTokenTransactionData, NewTransactionData } from '../../types'
import { getOutputParameters } from '../getOutputParameters'
import { prepareOutput, updateSelectedAccount } from '@core/account'
import { DEFAULT_TRANSACTION_OPTIONS } from '../../constants'
import { validateSendConfirmation } from '.'
import { checkActiveProfileAuth, getIsActiveLedgerProfile } from '@core/profile'
import { signLayer2TransferTransactionData } from '@core/layer-2'
import { ledgerPreparedOutput } from '@core/ledger'
import { sendOutput } from '../../actions'
import { handleError } from '@core/error/handlers'
import { NewTransactionType } from '@core/wallet/stores'

export async function createTransaction(
    transactionData: NewTransactionData,
    accountIndex: number,
    callback: () => void
): Promise<void> {
    if (transactionData.type === NewTransactionType.NftTransfer) {
        await sendFromLayer1(transactionData, accountIndex, callback)
        return
    }

    const asset = transactionData.asset
    if (!asset) {
        return
    }

    const isAssetFromLayer1 = !asset.chainId
    if (isAssetFromLayer1) {
        await sendFromLayer1(transactionData, accountIndex, callback)
    } else {
        await sendFromLayer2(transactionData, asset, callback)
    }
}

async function sendFromLayer1(
    transactionData: NewTransactionData,
    accountIndex: number,
    callback: () => void
): Promise<void> {
    const outputParams = await getOutputParameters(transactionData)
    const preparedOutput = await prepareOutput(accountIndex, outputParams, DEFAULT_TRANSACTION_OPTIONS)

    validateSendConfirmation(preparedOutput)

    if (getIsActiveLedgerProfile()) {
        ledgerPreparedOutput.set(preparedOutput)
    }

    await checkActiveProfileAuth(
        async () => {
            await sendOutput(preparedOutput)
            callback()
        },
        { stronghold: true, ledger: false }
    )
}

async function sendFromLayer2(
    transactionData: NewTokenTransactionData,
    asset: IAsset,
    callback: () => void
): Promise<void> {
    const chain = asset.chainId ? getNetwork()?.getChain(asset.chainId) : undefined
    const provider = chain?.getProvider()

    if (!chain || !provider || transactionData.recipient?.type !== 'address' || !asset.metadata) {
        return
    }

    const recipient = transactionData.recipient.address
    const amount = transactionDetails.rawAmount

    updateSelectedAccount({ isTransferring: true })
    try {
        const signature = await signLayer2TransferTransactionData(chain, recipient, asset, amount)
        if (signature) {
            await provider?.eth.sendSignedTransaction(signature)
            callback()
        } else {
            throw Error('No Signature provided')
        }
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
