import { NetworkId, getNetwork, isStardustNetwork } from '@core/network'
import { getSelectedAccount } from '@core/account/stores'
import { SendFlowParameters, SendFlowType, createStardustOutputFromSendFlowParameters } from '@core/wallet'
import { FALLBACK_ESTIMATED_GAS } from '../constants'
import { AssetType } from '../enums'
import { TransferredAsset } from '../types'
import { outputHexBytes } from '@core/wallet/api'
import { IGasCostEstimate } from '@core/network/interfaces/gas-cost-estimate.type'

export async function estimateGasForLayer1ToLayer2Transaction(sendFlowParameters: SendFlowParameters): Promise<number> {
    const { destinationNetworkId } = sendFlowParameters ?? {}

    if (!destinationNetworkId || (destinationNetworkId && isStardustNetwork(destinationNetworkId))) {
        return 0
    }

    const transferredAsset = getTransferredAsset(sendFlowParameters)
    if (!transferredAsset) {
        return 0
    }

    try {
        const gasEstimate = await getGasEstimateForOnLedgerIscpCall(destinationNetworkId, sendFlowParameters)
        return gasEstimate.gasFeeCharged ?? 0
    } catch (err) {
        console.error(err)
        return FALLBACK_ESTIMATED_GAS[sendFlowParameters.type]
    }
}

async function getGasEstimateForOnLedgerIscpCall(
    networkId: NetworkId,
    sendFlowParameters: SendFlowParameters
): Promise<IGasCostEstimate> {
    const chain = getNetwork()?.getChain(networkId)
    if (!chain) {
        return Promise.reject('Invalid chain')
    }
    const account = getSelectedAccount()
    const tempOutput = await createStardustOutputFromSendFlowParameters(sendFlowParameters, account)
    const outputBytes = await outputHexBytes(tempOutput)
    return chain.getGasEstimate(outputBytes)
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
        const amount = sendFlowParameters.tokenTransfer?.rawAmount ?? '0'

        return token
            ? {
                  type: AssetType.BaseCoin,
                  token,
                  amount,
              }
            : undefined
    } else {
        const token = sendFlowParameters.baseCoinTransfer?.token
        const amount = sendFlowParameters.baseCoinTransfer?.rawAmount ?? '0'

        return token
            ? {
                  type: AssetType.BaseCoin,
                  token,
                  amount,
              }
            : undefined
    }
}
