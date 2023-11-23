import { localize } from '@core/i18n'
import { IChain } from '@core/network/interfaces'
import { IAccountState } from '@core/account/interfaces'
import { buildEvmTransactionData, getIscpTransferSmartContractData } from '@core/layer-2/actions'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '@core/layer-2/constants'
import { AssetType } from '@core/layer-2/enums'
import { EvmTransactionData, TransferredAsset } from '@core/layer-2/types'
import { getErc20TransferSmartContractData } from '@core/layer-2/utils'
import { TokenStandard } from '@core/token/enums'
import { IToken } from '@core/token/interfaces'

import { SendFlowType } from '../../enums'
import { SendFlowParameters } from '../../types'
import { getAmountAndTokenFromSendFlowParameters } from '../../utils/send/getAmountAndTokenFromSendFlowParameters'
import { INft } from '@core/nfts/interfaces'

export function createEvmChainToEvmChainTransaction(
    sendFlowParameters: SendFlowParameters,
    chain: IChain,
    account: IAccountState
): Promise<EvmTransactionData> {
    if (!sendFlowParameters || !sendFlowParameters.recipient?.address) {
        throw new Error(localize('error.send.invalidSendParameters'))
    }

    const recipientAddress = sendFlowParameters.recipient.address

    const { evmAddresses } = account
    const originAddress = evmAddresses[chain.getConfiguration().coinType]
    if (!originAddress) {
        throw new Error(localize('error.send.unableToGetOriginAddress'))
    }

    let token: IToken | undefined
    let amount: string | undefined
    let nft: INft | undefined
    let destinationAddress: string | undefined

    if (
        sendFlowParameters.type === SendFlowType.TokenTransfer ||
        sendFlowParameters.type === SendFlowType.BaseCoinTransfer
    ) {
        const tokenAmount = getAmountAndTokenFromSendFlowParameters(sendFlowParameters)
        token = tokenAmount.token
        amount = tokenAmount.amount

        if (!token?.metadata) {
            throw new Error(localize('error.token.missingMetadata'))
        }

        if (amount === undefined) {
            throw new Error(localize('error.send.amountInvalidFormat'))
        }

        destinationAddress = getDestinationAddress(token, recipientAddress)
    } else {
        nft = sendFlowParameters.nft
        destinationAddress = ISC_MAGIC_CONTRACT_ADDRESS
    }

    let data: string | undefined
    if (token?.standard === TokenStandard.Irc30 || token?.standard === TokenStandard.Erc20 || nft) {
        data = getDataForTransaction(chain, recipientAddress, token, amount, nft)
        // set amount to zero after using it to build the smart contract data,
        // as we do not want to send any base token
        amount = '0'
        if (!data) {
            throw new Error(localize('error.web3.unableToFormSmartContractData'))
        }
    } else {
        data = undefined
    }

    return buildEvmTransactionData(provider, originAddress, destinationAddress, amount ?? '0', data)
}

function getDataForTransaction(
    chain: IChain,
    recipientAddress: string,
    token: IToken | undefined,
    amount: string | undefined,
    nft: INft | undefined
): string | undefined {
    if (token && amount) {
        const standard = token.metadata?.standard
        switch (standard) {
            case TokenStandard.Irc30: {
                const isBaseCoin = token.standard === TokenStandard.BaseToken
                const assetType = isBaseCoin ? AssetType.BaseCoin : AssetType.Token
                const transferredAsset = { type: assetType, token, amount } as TransferredAsset
                return getIscpTransferSmartContractData(recipientAddress, transferredAsset, chain)
            }
            case TokenStandard.Erc20:
                return getErc20TransferSmartContractData(recipientAddress, token, amount, chain)
            default:
                return undefined
        }
    } else if (nft) {
        const transferredAsset = { type: AssetType.Nft, nft } as TransferredAsset
        return getIscpTransferSmartContractData(recipientAddress, transferredAsset, chain)
    }
}

function getDestinationAddress(token: IToken, recipientAddress: string): string {
    const standard = token.metadata?.standard
    switch (standard) {
        case TokenStandard.BaseToken:
            return recipientAddress
        case TokenStandard.Irc30:
            return ISC_MAGIC_CONTRACT_ADDRESS
        case TokenStandard.Erc20:
            return token.id
        default:
            return recipientAddress
    }
}
