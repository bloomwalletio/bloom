import { getNetwork, isStardustNetwork } from '@core/network'
import { getSelectedAccount } from '@core/account/stores'
import { SendFlowParameters, SendFlowType } from '@core/wallet'
import { FALLBACK_ESTIMATED_GAS, ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import { AssetType } from '../enums'
import { TransferredAsset } from '../types'
import { getIscpTransferSmartContractData } from '../utils'

export async function estimateGasForLayer1ToLayer2Transaction(sendFlowParameters: SendFlowParameters): Promise<number> {
    const { recipient, destinationNetworkId } = sendFlowParameters ?? {}

    if (destinationNetworkId && isStardustNetwork(destinationNetworkId)) {
        return 0
    }

    const address = recipient?.address ?? ''

    const chain = destinationNetworkId ? getNetwork()?.getChain(destinationNetworkId) : undefined
    const provider = chain?.getProvider()
    const transferredAsset = getTransferredAsset(sendFlowParameters)

    const fallbackGas = FALLBACK_ESTIMATED_GAS.toJSNumber()
    if (!chain || !provider || !transferredAsset) {
        return fallbackGas
    }

    try {
        const coinType = chain.getConfiguration().coinType
        const evmAddress = getSelectedAccount()?.evmAddresses?.[coinType]
        const data = getIscpTransferSmartContractData(address, transferredAsset, chain)
        if (data) {
            const gas = await provider.eth.estimateGas({
                from: evmAddress,
                to: ISC_MAGIC_CONTRACT_ADDRESS,
                data,
            })
            return gas
        } else {
            return Promise.resolve(fallbackGas)
        }
    } catch (err) {
        // If the from in estimateGas doesn't have funds,  the node throw an error.
        console.error(err)
        return Promise.resolve(fallbackGas)
    }
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
