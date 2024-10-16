import { NovesTxResponse } from '@auxiliary/noves'
import { IAccountState } from '@core/account'
import { EvmActivityType } from '@core/activity/enums/evm'
import { BaseEvmActivity, EvmActivity, EvmCoinTransferActivity, EvmTokenTransferActivity } from '@core/activity/types'
import { IEvmNetwork } from '@core/network'
import { BASE_TOKEN_ID, TokenStandard } from '@core/token'
import { Converter } from '@core/utils'
import { SubjectType } from '@core/wallet'
import { ActivityDirection } from '@core/activity/enums'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'
import { LocalEvmTransaction } from '@core/transactions/types'

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

    // TODO: handle novesTx.classificationData.type

    if (novesTx.classificationData.sent.length > 0) {
        const sentToken = novesTx.classificationData.sent[0].token
        if (sentToken.symbol === evmNetwork.baseToken.tickerSymbol) {
            return generateEvmCoinTransferActivity(baseActivity, novesTx)
        } else {
            return generateEvmTokenTransferActivity(baseActivity, novesTx)
        }
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
        status: localTransaction?.status ?? false,
        transactionIndex: localTransaction?.transactionIndex ?? 0,
        to: novesTx.rawTransactionData.toAddress.toLowerCase(),
    }

    const baseActivity = await generateBaseEvmActivity(newTransaction, evmNetwork, account)

    const sent = novesTx.classificationData.sent[0]
    const received = novesTx.classificationData.received[0]

    if (sent) {
        baseActivity.sender = {
            type: SubjectType.Account,
            address: sent.from.address?.toLowerCase() ?? '',
            account: account,
        }
    }

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

function generateEvmCoinTransferActivity(
    baseActivity: BaseEvmActivity,
    novesTx: NovesTxResponse
): EvmCoinTransferActivity {
    const sent = novesTx.classificationData.sent[0]
    const amountString = sent.amount
    const decimals = novesTx.rawTransactionData.transactionFee.token.decimals ?? 18

    // Convert the decimal string to a bigint
    let rawAmount: bigint
    if (amountString.includes('.')) {
        const [intPart, fracPart] = amountString.split('.')
        const scaleFactor = BigInt(10 ** decimals)
        rawAmount = BigInt(intPart) * scaleFactor + BigInt(fracPart.padEnd(decimals, '0').slice(0, decimals))
    } else {
        rawAmount = BigInt(amountString) * BigInt(10 ** decimals)
    }

    return {
        ...baseActivity,
        type: EvmActivityType.CoinTransfer,
        baseTokenTransfer: {
            tokenId: BASE_TOKEN_ID,
            rawAmount: rawAmount,
        },
    }
}

function generateEvmTokenTransferActivity(
    baseActivity: BaseEvmActivity,
    novesTx: NovesTxResponse
): EvmTokenTransferActivity {
    const sent = novesTx.classificationData.sent[0]
    return {
        ...baseActivity,
        type: EvmActivityType.TokenTransfer,
        tokenTransfer: {
            standard: TokenStandard.Erc20,
            tokenId: sent.token.address?.toLowerCase() ?? '',
            rawAmount: Converter.bigIntLikeToBigInt(sent.amount),
        },
        rawData: JSON.stringify(novesTx.rawTransactionData),
    }
}
