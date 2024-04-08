import { localize } from '@core/i18n'
import { IChain } from '@core/network/interfaces'
import { IAccountState } from '@core/account/interfaces'
import { buildEvmTransactionDataForNft, buildEvmTransactionDataForToken } from '@core/layer-2/utils'
import { EvmTransactionData } from '@core/layer-2/types'
import { SendFlowType } from '../../enums'
import { SendFlowParameters } from '../../types'
import { getAmountAndTokenFromSendFlowParameters } from '../../utils/send/getAmountAndTokenFromSendFlowParameters'

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
    const originAddress = evmAddresses[chain.coinType]
    if (!originAddress) {
        throw new Error(localize('error.send.unableToGetOriginAddress'))
    }

    if (
        sendFlowParameters.type === SendFlowType.TokenTransfer ||
        sendFlowParameters.type === SendFlowType.BaseCoinTransfer
    ) {
        const tokenAmount = getAmountAndTokenFromSendFlowParameters(sendFlowParameters)
        const token = tokenAmount.token
        const amount = tokenAmount.amount

        if (!token?.metadata) {
            throw new Error(localize('error.token.missingMetadata'))
        }

        if (amount === undefined) {
            throw new Error(localize('error.send.amountInvalidFormat'))
        }
        return buildEvmTransactionDataForToken(chain, originAddress, recipientAddress, amount, token)
    } else {
        const nft = sendFlowParameters.nft
        if (!nft) {
            throw new Error(localize('error.send.invalidSendParameters'))
        }

        return buildEvmTransactionDataForNft(chain, originAddress, recipientAddress, nft)
    }
}
