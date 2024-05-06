import { NetworkId, getIscChain, isStardustNetwork } from '@core/network'
import { getSelectedAccount } from '@core/account/stores'
import { SendFlowParameters, SendFlowType, createStardustOutputFromSendFlowParameters } from '@core/wallet'
import { FALLBACK_ESTIMATED_GAS } from '../constants'
import { AssetType } from '../enums'
import { TransferredAsset } from '../types'
import { outputHexBytes } from '@core/wallet/api'

export async function getGasFeeForLayer1ToLayer2Transaction(sendFlowParameters: SendFlowParameters): Promise<bigint> {
    const { destinationNetworkId } = sendFlowParameters ?? {}

    if (!destinationNetworkId || (destinationNetworkId && isStardustNetwork(destinationNetworkId))) {
        return BigInt(0)
    }

    const transferredAsset = getTransferredAsset(sendFlowParameters)
    if (!transferredAsset) {
        return BigInt(0)
    }

    try {
        const gasFeeEstimate = await getGasFeeEstimateForIscCall(destinationNetworkId, sendFlowParameters)
        return gasFeeEstimate
    } catch (err) {
        console.error(err)
        return BigInt(FALLBACK_ESTIMATED_GAS[sendFlowParameters.type])
    }
}

async function getGasFeeEstimateForIscCall(
    networkId: NetworkId,
    sendFlowParameters: SendFlowParameters
): Promise<bigint> {
    const iscChain = getIscChain(networkId)
    if (!iscChain) {
        return Promise.reject('Invalid network')
    }
    const account = getSelectedAccount()
    const tempOutput = await createStardustOutputFromSendFlowParameters(sendFlowParameters, account)
    const outputBytes = await outputHexBytes(tempOutput)
    return iscChain.getGasFeeEstimate(outputBytes)
}

function getTransferredAsset(sendFlowParameters: SendFlowParameters): TransferredAsset | undefined {
    if (sendFlowParameters.type === SendFlowType.NftTransfer) {
        return sendFlowParameters.nft
            ? {
                  type: AssetType.Nft,
                  nft: sendFlowParameters.nft,
              }
            : undefined
    } else if (sendFlowParameters.type === SendFlowType.TokenTransfer) {
        const token = sendFlowParameters.tokenTransfer?.token
        const amount = sendFlowParameters.tokenTransfer?.rawAmount ?? BigInt(0)

        return token
            ? {
                  type: AssetType.BaseCoin,
                  token,
                  amount,
              }
            : undefined
    } else {
        const token = sendFlowParameters.baseCoinTransfer?.token
        const amount = sendFlowParameters.baseCoinTransfer?.rawAmount ?? BigInt(0)

        return token
            ? {
                  type: AssetType.BaseCoin,
                  token,
                  amount,
              }
            : undefined
    }
}
