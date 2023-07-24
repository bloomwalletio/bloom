import { IAccountState } from '@core/account'
import {
    buildEvmTransactionData,
    getErc20TransferSmartContractData,
    getIscpTransferSmartContractData,
} from '@core/layer-2/utils'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '@core/layer-2/constants'
import { EvmTransactionData } from '@core/layer-2/types'
import { IChain } from '@core/network/interfaces'
import { SubjectType, TokenStandard } from '@core/wallet/enums'
import { IAsset } from '@core/wallet/interfaces'
import { SendFlowType } from '@core/wallet/stores'
import { SendFlowParameters } from '@core/wallet/types'

export function createEvmTransactionFromSendFlowParameters(
    sendFlowParameters: SendFlowParameters,
    chain: IChain,
    account: IAccountState
): Promise<EvmTransactionData | undefined> {
    if (!sendFlowParameters || sendFlowParameters.type === SendFlowType.NftTransfer) {
        return Promise.resolve(undefined)
    }

    const provider = chain?.getProvider()

    let asset
    let amount
    if (sendFlowParameters.type === SendFlowType.BaseCoinTransfer) {
        asset = sendFlowParameters.baseCoinTransfer?.asset
        amount = sendFlowParameters.baseCoinTransfer?.rawAmount ?? '0'
    } else if (sendFlowParameters.type === SendFlowType.TokenTransfer) {
        asset = sendFlowParameters.tokenTransfer?.asset
        amount = sendFlowParameters.tokenTransfer?.rawAmount ?? '0'
    }

    if (sendFlowParameters.recipient?.type !== SubjectType.Address || !asset?.metadata || amount === undefined) {
        return Promise.resolve(undefined)
    }

    const recipientAddress = sendFlowParameters.recipient.address

    const { evmAddresses } = account
    const originAddress = evmAddresses[chain.getConfiguration().coinType]
    if (!originAddress) {
        return Promise.resolve(undefined)
    }

    const destinationAddress = getDestinationAddress(asset, recipientAddress)

    let data
    if (!asset || asset.metadata?.standard === TokenStandard.BaseToken) {
        data = undefined
    } else {
        data = getDataForTransaction(chain, recipientAddress, asset, amount)
        // set amount to zero after using it to build the smart contract data,
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
    asset: IAsset,
    amount: string
): string | undefined {
    const standard = asset.metadata?.standard
    switch (standard) {
        case TokenStandard.Irc30:
            return getIscpTransferSmartContractData(recipientAddress, asset, amount, chain)
        case TokenStandard.Erc20:
            return getErc20TransferSmartContractData(recipientAddress, asset, amount, chain)
        default:
            return undefined
    }
}

function getDestinationAddress(asset: IAsset, recipientAddress: string): string {
    const standard = asset.metadata?.standard
    switch (standard) {
        case TokenStandard.BaseToken:
            return recipientAddress
        case TokenStandard.Irc30:
            return ISC_MAGIC_CONTRACT_ADDRESS
        case TokenStandard.Erc20:
            return asset.id
        default:
            return recipientAddress
    }
}
