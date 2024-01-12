import { localize } from '@core/i18n'
import { IChain } from '@core/network/interfaces'
import { IAccountState } from '@core/account/interfaces'
import { buildEvmTransactionData, getIscpTransferSmartContractData } from '@core/layer-2/actions'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '@core/layer-2/constants'
import { AssetType } from '@core/layer-2/enums'
import { EvmTransactionData, TransferredAsset } from '@core/layer-2/types'
import { getErc20TransferSmartContractData, getErc721TransferSmartContractData } from '@core/layer-2/utils'
import { TokenStandard } from '@core/token/enums'
import { IToken } from '@core/token/interfaces'
import { SendFlowType } from '../../enums'
import { SendFlowParameters } from '../../types'
import { getAmountAndTokenFromSendFlowParameters } from '../../utils/send/getAmountAndTokenFromSendFlowParameters'
import { Nft } from '@core/nfts/interfaces'
import { NftStandard } from '@core/nfts'

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
    let nft: Nft | undefined
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

        destinationAddress = getDestinationAddressForToken(token, recipientAddress)
    } else {
        nft = sendFlowParameters.nft
        if (!nft) {
            throw new Error(localize('error.send.invalidSendParameters'))
        }
        destinationAddress = getDestinationAddressForNft(nft)
    }

    let data: string | undefined
    if (token?.standard === TokenStandard.Irc30 || token?.standard === TokenStandard.Erc20 || nft) {
        data =
            token && amount
                ? getTokenDataForTransaction(chain, recipientAddress, token, amount)
                : nft
                ? getNftDataForTransaction(chain, originAddress, recipientAddress, nft)
                : undefined

        // set amount to zero after using it to build the smart contract data,
        // as we do not want to send any base token
        amount = '0'
        if (!data) {
            throw new Error(localize('error.web3.unableToFormSmartContractData'))
        }
    } else {
        data = undefined
    }

    return buildEvmTransactionData(chain, originAddress, destinationAddress, amount ?? '0', data)
}

function getTokenDataForTransaction(
    chain: IChain,
    recipientAddress: string,
    token: IToken,
    amount: string
): string | undefined {
    switch (token?.metadata?.standard) {
        case TokenStandard.Irc30: {
            const isBaseCoin = token.standard === TokenStandard.BaseToken
            const assetType = isBaseCoin ? AssetType.BaseCoin : AssetType.Token
            const transferredAsset = { type: assetType, token, amount } as TransferredAsset
            return getIscpTransferSmartContractData(recipientAddress, transferredAsset, chain)
        }
        case TokenStandard.Erc20:
            return getErc20TransferSmartContractData(recipientAddress, token, amount ?? '', chain)
        default:
            return undefined
    }
}

function getNftDataForTransaction(
    chain: IChain,
    originAddress: string,
    recipientAddress: string,
    nft: Nft
): string | undefined {
    const transferredAsset = { type: AssetType.Nft, nft } as TransferredAsset
    switch (nft.standard) {
        case NftStandard.Irc27:
            return getIscpTransferSmartContractData(recipientAddress, transferredAsset, chain)
        case NftStandard.Erc721: {
            const nftAddress = nft.contractMetadata?.address ?? ''
            const nftTokenId = nft.tokenId ?? ''
            return getErc721TransferSmartContractData(originAddress, recipientAddress, nftAddress, nftTokenId, chain)
        }
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

function getDestinationAddressForNft(nft: Nft): string {
    const standard = nft?.standard
    switch (standard) {
        case NftStandard.Erc721:
            return nft.contractMetadata.address
        case NftStandard.Irc27:
            return ISC_MAGIC_CONTRACT_ADDRESS
        default:
            throw new Error(localize('error.send.invalidSendParameters'))
    }
}
