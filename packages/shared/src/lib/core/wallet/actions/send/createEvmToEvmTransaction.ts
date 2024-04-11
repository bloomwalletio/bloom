import { localize } from '@core/i18n'
import { IEvmNetwork } from '@core/network/interfaces'
import { IAccountState } from '@core/account/interfaces'
import { buildEvmTransactionDataForNft, buildEvmTransactionDataForToken } from '@core/layer-2/utils'
import { EvmTransactionData } from '@core/layer-2/types'
import { SendFlowType } from '../../enums'
import { SendFlowParameters } from '../../types'
import { getAmountAndTokenFromSendFlowParameters } from '../../utils/send/getAmountAndTokenFromSendFlowParameters'

export function createEvmToEvmTransaction(
    sendFlowParameters: SendFlowParameters,
    evmNetwork: IEvmNetwork,
    account: IAccountState
): Promise<EvmTransactionData> {
    if (!sendFlowParameters || !sendFlowParameters.recipient?.address) {
        throw new Error(localize('error.send.invalidSendParameters'))
    }

    const recipientAddress = sendFlowParameters.recipient.address

    const { evmAddresses } = account
    const originAddress = evmAddresses[evmNetwork.coinType]
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
        return buildEvmTransactionDataForToken(evmNetwork, originAddress, recipientAddress, amount, token)
    } else {
        const nft = sendFlowParameters.nft
        if (!nft) {
            throw new Error(localize('error.send.invalidSendParameters'))
        }

        return buildEvmTransactionDataForNft(evmNetwork, originAddress, recipientAddress, nft)
    }
}
