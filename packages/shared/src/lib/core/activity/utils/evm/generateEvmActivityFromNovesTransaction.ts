import { NovesTxResponse } from '@auxiliary/noves'
import { IAccountState } from '@core/account'
import { EvmActivityType } from '@core/activity/enums/evm'
import { BaseEvmActivity, EvmActivity, EvmCoinTransferActivity, EvmTokenTransferActivity } from '@core/activity/types'
import { IEvmNetwork } from '@core/network'
import { BASE_TOKEN_ID, convertToRawAmount, IErc20Metadata, TokenStandard } from '@core/token'
import { Converter } from '@core/utils'
import { IAccountSubject, SubjectType } from '@core/wallet'
import { ActivityDirection } from '@core/activity/enums'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'
import { LocalEvmTransaction } from '@core/transactions/types'
import { generateEvmActivityFromLocalEvmTransaction } from './generateEvmActivityFromLocalEvmTransaction'

export async function generateEvmActivityFromNovesTransaction(
    novesTx: NovesTxResponse,
    localTransaction: LocalEvmTransaction | undefined,
    evmNetwork: IEvmNetwork,
    account: IAccountState
): Promise<EvmActivity | undefined> {
    const baseActivity = await generateBaseEvmActivityFromNovesTransaction(
        novesTx,
        localTransaction,
        evmNetwork,
        account
    )

    switch (
        novesTx.classificationData.type // What are all the types and interfaces for this?
    ) {
        case 'sendToken': // TODO: this string should be an enum
            return generateEvmActivityFromSendTokenClassification(baseActivity, novesTx, account)
        case 'receiveToken':
            return generateEvmActivityFromReceiveTokenClassification(baseActivity, novesTx, account)
        default:
            return localTransaction
                ? generateEvmActivityFromLocalEvmTransaction(localTransaction, evmNetwork, account)
                : undefined
    }
}

async function generateBaseEvmActivityFromNovesTransaction(
    novesTx: NovesTxResponse,
    localTransaction: LocalEvmTransaction | undefined,
    evmNetwork: IEvmNetwork,
    account: IAccountState
): Promise<BaseEvmActivity> {
    const newTransaction = {
        recipient: novesTx.rawTransactionData.toAddress.toLowerCase(),
        from: novesTx.rawTransactionData.fromAddress.toLowerCase(),
        gasUsed: novesTx.rawTransactionData.gasUsed,
        gasPrice: BigInt(novesTx.rawTransactionData.gasPrice),
        transactionHash: novesTx.rawTransactionData.transactionHash,
        timestamp: novesTx.rawTransactionData.timestamp,
        blockNumber: novesTx.rawTransactionData.blockNumber,
        confirmations: localTransaction?.confirmations ?? 0,
        status: localTransaction?.status ?? true,
        transactionIndex: localTransaction?.transactionIndex ?? 0,
        to: novesTx.rawTransactionData.toAddress.toLowerCase(),
    }

    const baseActivity = await generateBaseEvmActivity(newTransaction, evmNetwork, account)

    const received = novesTx.classificationData.received[0]

    if (received) {
        baseActivity.recipient = {
            type: SubjectType.Account,
            address: received.to.address?.toLowerCase() ?? '',
            account: account,
        }
    }

    baseActivity.subject =
        baseActivity.direction === ActivityDirection.Outgoing ? baseActivity.recipient : baseActivity.sender

    return baseActivity
}

function generateEvmActivityFromSendTokenClassification(
    baseActivity: BaseEvmActivity,
    novesTx: NovesTxResponse,
    account: IAccountState
): EvmTokenTransferActivity | EvmCoinTransferActivity {
    const sent = novesTx.classificationData.sent[0]

    const sender: IAccountSubject = {
        type: SubjectType.Account,
        address: sent.from.address?.toLowerCase() ?? '',
        account: account,
    }

    const amountString = sent.amount
    const rawAmount = convertToRawAmount(amountString, {
        ...sent.token,
        standard: TokenStandard.Erc20,
    } as IErc20Metadata)

    const isBaseTokenTransfer = Converter.isHex(sent.token.address ?? '')

    if (isBaseTokenTransfer) {
        return {
            ...baseActivity,
            type: EvmActivityType.CoinTransfer,
            sender,
            baseTokenTransfer: {
                tokenId: BASE_TOKEN_ID,
                rawAmount: rawAmount ?? BigInt(0),
            },
        }
    } else {
        return {
            ...baseActivity,
            type: EvmActivityType.TokenTransfer,
            sender,
            tokenTransfer: {
                standard: TokenStandard.Erc20,
                tokenId: sent.token.address?.toLowerCase() ?? '',
                rawAmount: rawAmount ?? BigInt(0),
            },
            rawData: '',
        }
    }
}

function generateEvmActivityFromReceiveTokenClassification(
    baseActivity: BaseEvmActivity,
    novesTx: NovesTxResponse,
    account: IAccountState
): EvmTokenTransferActivity | EvmCoinTransferActivity {
    const received = novesTx.classificationData.received[0]

    const recipient: IAccountSubject = {
        type: SubjectType.Account,
        address: received.from.address?.toLowerCase() ?? '',
        account: account,
    }

    const amountString = received.amount
    const rawAmount = convertToRawAmount(amountString, {
        ...received.token,
        standard: TokenStandard.Erc20,
    } as IErc20Metadata)

    const isBaseTokenTransfer = Converter.isHex(received.token.address ?? '')

    if (isBaseTokenTransfer) {
        return {
            ...baseActivity,
            type: EvmActivityType.CoinTransfer,
            recipient,
            baseTokenTransfer: {
                tokenId: BASE_TOKEN_ID,
                rawAmount: rawAmount ?? BigInt(0),
            },
        }
    } else {
        return {
            ...baseActivity,
            type: EvmActivityType.TokenTransfer,
            recipient,
            tokenTransfer: {
                standard: TokenStandard.Erc20,
                tokenId: received.token.address?.toLowerCase() ?? '',
                rawAmount: rawAmount ?? BigInt(0),
            },
            rawData: '',
        }
    }
}
