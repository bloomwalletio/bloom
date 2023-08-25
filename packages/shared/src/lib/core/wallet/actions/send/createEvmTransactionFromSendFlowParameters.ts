import { IAccountState } from '@core/account'
import { AssetType } from '@core/layer-2'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '@core/layer-2/constants'
import { EvmTransactionData, TransferredAsset } from '@core/layer-2/types'
import {
    buildEvmTransactionData,
    getErc20TransferSmartContractData,
    getIscpTransferSmartContractData,
} from '@core/layer-2/utils'
import { IChain } from '@core/network/interfaces'
import { IToken } from '@core/token/interfaces'
import { TokenStandard } from '@core/token/enums'
import { SendFlowType } from '@core/wallet/stores'
import { SendFlowParameters } from '@core/wallet/types'

export function createEvmTransactionFromSendFlowParameters(
    sendFlowParameters: SendFlowParameters,
    chain: IChain,
    account: IAccountState
): Promise<EvmTransactionData | undefined> {
    if (
        !sendFlowParameters ||
        sendFlowParameters.type === SendFlowType.NftTransfer ||
        !sendFlowParameters.recipient?.address
    ) {
        return Promise.resolve(undefined)
    }

    const provider = chain?.getProvider()

    let token
    let amount
    if (sendFlowParameters.type === SendFlowType.BaseCoinTransfer) {
        token = sendFlowParameters.baseCoinTransfer?.token
        amount = sendFlowParameters.baseCoinTransfer?.rawAmount ?? '0'
    } else if (sendFlowParameters.type === SendFlowType.TokenTransfer) {
        token = sendFlowParameters.tokenTransfer?.token
        amount = sendFlowParameters.tokenTransfer?.rawAmount ?? '0'
    }

    if (!token?.metadata || amount === undefined) {
        return Promise.resolve(undefined)
    }

    const recipientAddress = sendFlowParameters.recipient.address

    const { evmAddresses } = account
    const originAddress = evmAddresses[chain.getConfiguration().coinType]
    if (!originAddress) {
        return Promise.resolve(undefined)
    }

    const destinationAddress = getDestinationAddress(token, recipientAddress)

    let data
    if (!token || token.metadata?.standard === TokenStandard.BaseToken) {
        data = undefined
    } else {
        data = getDataForTransaction(chain, recipientAddress, token, amount)
        // set amount to zero after using it to bui
        // ld the smart contract data,
        // as we do not want to send any base token
        amount = '0'
        if (!data) {
            return Promise.resolve(undefined)
        }
    }

    return buildEvmTransactionData(provider, originAddress, destinationAddress, amount, data)
}

function getDataForTransaction(
    chain: IChain,
    recipientAddress: string,
    token: IToken,
    amount: string
): string | undefined {
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
