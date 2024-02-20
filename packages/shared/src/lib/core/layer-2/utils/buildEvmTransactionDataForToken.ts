import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import { EvmTransactionData, TransferredAsset } from '../types'
import { IChain } from '@core/network'
import { localize } from '@core/i18n'
import { IToken, TokenStandard } from '@core/token'
import { buildEvmTransactionData } from './buildEvmTransactionData'
import { getIscpTransferSmartContractData } from '../actions/getIscpTransferSmartContractData'
import { getErc20TransferSmartContractData } from '.'
import { AssetType } from '../enums'

export async function buildEvmTransactionDataForToken(
    chain: IChain,
    originAddress: string,
    recipientAddress: string,
    amount: bigint,
    token: IToken
): Promise<EvmTransactionData> {
    const destinationAddress = getDestinationAddressForToken(token, recipientAddress)

    let data: string | undefined
    if (token.standard === TokenStandard.Irc30 || token.standard === TokenStandard.Erc20) {
        data = getTokenDataForTransaction(chain, recipientAddress, token, amount)

        if (!data) {
            throw new Error(localize('error.web3.unableToFormSmartContractData'))
        }

        // set amount to zero after using it to build the smart contract data,
        // as we do not want to send any base token
        amount = BigInt(0)
    }
    return buildEvmTransactionData(chain, originAddress, destinationAddress, amount, data)
}

function getTokenDataForTransaction(
    chain: IChain,
    recipientAddress: string,
    token: IToken,
    amount: bigint
): string | undefined {
    switch (token?.metadata?.standard) {
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
