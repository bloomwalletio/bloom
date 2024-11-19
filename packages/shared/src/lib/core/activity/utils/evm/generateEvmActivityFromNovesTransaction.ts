import { NovesTxResponse } from '@auxiliary/noves'
import { IAccountState } from '@core/account'
import { EvmActivityType } from '@core/activity/enums/evm'
import {
    BaseEvmActivity,
    EvmActivity,
    EvmCoinTransferActivity,
    EvmTokenTransferActivity,
    EvmTokenApprovalActivity,
    EvmContractCallActivity,
} from '@core/activity/types'
import { IEvmNetwork } from '@core/network'
import { BASE_TOKEN_ID, convertToRawAmount, IErc20Metadata, TokenStandard } from '@core/token'
import { Converter } from '@core/utils'
import { IAccountSubject, SubjectType } from '@core/wallet'
import { ActivityDirection } from '@core/activity/enums'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'
import { LocalEvmTransaction } from '@core/transactions/types'
import { generateEvmActivityFromLocalEvmTransaction } from './generateEvmActivityFromLocalEvmTransaction'
import {
    NovesTxTypeToken,
    NovesTxTypeNFT,
    NovesTxTypeInfrastructure,
    NovesTxTypeDEX,
    NovesTxTypeLending,
    NovesTxTypeYield,
} from '@auxiliary/noves/enums'
import { NftStandard } from '@core/nfts'

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

    switch (novesTx.classificationData.type) {
        case NovesTxTypeToken.SendToken:
        case NovesTxTypeToken.SendTokenAirdrop:
            return generateEvmActivityFromSendTokenClassification(baseActivity, novesTx, account)
        case NovesTxTypeToken.ReceiveToken:
        case NovesTxTypeToken.ReceiveTokenAirdrop:
        case NovesTxTypeToken.ReceiveSpamToken:
            return generateEvmActivityFromReceiveTokenClassification(baseActivity, novesTx, account)
        case NovesTxTypeToken.ApproveToken:
        case NovesTxTypeToken.RevokeTokenApproval:
            return generateEvmActivityFromApproveTokenClassification(baseActivity, novesTx)
        case NovesTxTypeNFT.SendNFT:
        case NovesTxTypeNFT.SendNFTAirdrop:
        case NovesTxTypeNFT.ReceiveNFT:
        case NovesTxTypeNFT.ReceiveNFTAirdrop:
        case NovesTxTypeNFT.ReceiveSpamNFT:
            return generateEvmActivityFromNFTTransferClassification(baseActivity, novesTx)
        case NovesTxTypeNFT.ApproveNFTCollection:
        case NovesTxTypeNFT.ApproveSingleNFT:
        case NovesTxTypeNFT.RevokeNFTCollectionApproval:
            return generateEvmActivityFromNFTApprovalClassification(baseActivity, novesTx)
        case NovesTxTypeInfrastructure.CreateContract:
        case NovesTxTypeInfrastructure.DeployContract:
            return {
                ...baseActivity,
                type: EvmActivityType.ContractCall,
                rawData: '',
            } as EvmContractCallActivity
        case NovesTxTypeDEX.Swap:
        case NovesTxTypeDEX.AddLiquidity:
        case NovesTxTypeDEX.RemoveLiquidity:
        case NovesTxTypeLending.Borrow:
        case NovesTxTypeLending.RepayLoan:
        case NovesTxTypeYield.StakeToken:
        case NovesTxTypeYield.UnstakeToken:
            return {
                ...baseActivity,
                type: EvmActivityType.ContractCall,
                rawData: '',
                method: novesTx.classificationData.type,
            } as EvmContractCallActivity
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

    const isBaseTokenTransfer = !Converter.isHex(sent.token.address ?? '')

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

    const isBaseTokenTransfer = !Converter.isHex(received.token.address ?? '')

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

function generateEvmActivityFromApproveTokenClassification(
    baseActivity: BaseEvmActivity,
    novesTx: NovesTxResponse
): EvmTokenApprovalActivity {
    const sent = novesTx.classificationData.sent[0]

    const amountString = sent.amount
    const rawAmount = convertToRawAmount(amountString, {
        ...sent.token,
        standard: TokenStandard.Erc20,
    } as IErc20Metadata)

    return {
        ...baseActivity,
        type: EvmActivityType.TokenApproval,
        tokenTransfer: {
            standard: TokenStandard.Erc20,
            tokenId: sent.token.address?.toLowerCase() ?? '',
            rawAmount: rawAmount ?? BigInt(0),
        },
        direction: ActivityDirection.SelfTransaction,
        rawData: '',
    }
}

function generateEvmActivityFromNFTTransferClassification(
    baseActivity: BaseEvmActivity,
    novesTx: NovesTxResponse
): EvmTokenTransferActivity {
    const transfer = novesTx.classificationData.type.startsWith('send')
        ? novesTx.classificationData.sent[0]
        : novesTx.classificationData.received[0]

    return {
        ...baseActivity,
        type: EvmActivityType.TokenTransfer,
        tokenTransfer: {
            standard: NftStandard.Erc721,
            tokenId: transfer.token.address?.toLowerCase() ?? '',
            rawAmount: BigInt(1),
        },
        rawData: '',
    }
}

function generateEvmActivityFromNFTApprovalClassification(
    baseActivity: BaseEvmActivity,
    novesTx: NovesTxResponse
): EvmTokenApprovalActivity {
    const sent = novesTx.classificationData.sent[0]

    return {
        ...baseActivity,
        type: EvmActivityType.TokenApproval,
        tokenTransfer: {
            standard: NftStandard.Erc721,
            tokenId: sent.token.address?.toLowerCase() ?? '',
            rawAmount: BigInt(1),
        },
        direction: ActivityDirection.SelfTransaction,
        rawData: '',
    }
}
