import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import { EvmTransactionData, TransferredAsset } from '../types'
import { IEvmNetwork, IscChain } from '@core/network'
import { localize } from '@core/i18n'
import { IToken, TokenStandard } from '@core/token'
import { buildEvmTransactionData } from './buildEvmTransactionData'
import { getIscTransferSmartContractData } from '../actions/getIscTransferSmartContractData'
import { getErc20TransferSmartContractData } from '.'
import { AssetType } from '../enums'

export async function buildEvmTransactionDataForToken(
    evmNetwork: IEvmNetwork,
    originAddress: string,
    recipientAddress: string,
    amount: bigint,
    token: IToken
): Promise<EvmTransactionData> {
    const destinationAddress = getDestinationAddressForToken(token, recipientAddress)

    let data: string | undefined
    if (token.standard === TokenStandard.Irc30 || token.standard === TokenStandard.Erc20) {
        data = getTokenDataForTransaction(evmNetwork, recipientAddress, token, amount)

        if (!data) {
            throw new Error(localize('error.web3.unableToFormSmartContractData'))
        }

        // set amount to zero after using it to build the smart contract data,
        // as we do not want to send any base token
        amount = BigInt(0)
    }
    return buildEvmTransactionData(evmNetwork, originAddress, destinationAddress, amount, data)
}

function getTokenDataForTransaction(
    evmNetwork: IEvmNetwork,
    recipientAddress: string,
    token: IToken,
    amount: bigint
): string | undefined {
    switch (token?.metadata?.standard) {
        case TokenStandard.Irc30: {
            const isBaseCoin = token.standard === TokenStandard.BaseToken
            const assetType = isBaseCoin ? AssetType.BaseCoin : AssetType.Token
            const transferredAsset = { type: assetType, token, amount } as TransferredAsset
            return getIscTransferSmartContractData(recipientAddress, transferredAsset, evmNetwork as IscChain)
        }
        case TokenStandard.Erc20:
            return getErc20TransferSmartContractData(recipientAddress, token, amount, evmNetwork)
        default:
            return undefined
    }
}

function getDestinationAddressForToken(token: IToken, recipientAddress: string): string {
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
