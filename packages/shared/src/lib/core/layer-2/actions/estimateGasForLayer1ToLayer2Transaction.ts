import { NetworkId, getNetwork, isStardustNetwork } from '@core/network'
import { getSelectedAccount } from '@core/account/stores'
import { SendFlowParameters, SendFlowType } from '@core/wallet'
import { FALLBACK_ESTIMATED_GAS, ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import { AssetType } from '../enums'
import { TransferredAsset } from '../types'
import { getIscpTransferSmartContractData } from '../utils'

export async function estimateGasForLayer1ToLayer2Transaction(sendFlowParameters: SendFlowParameters): Promise<number> {
    const { recipient, destinationNetworkId } = sendFlowParameters ?? {}

    if (!destinationNetworkId || (destinationNetworkId && isStardustNetwork(destinationNetworkId))) {
        return 0
    }

    const transferredAsset = getTransferredAsset(sendFlowParameters)
    if (!transferredAsset) {
        return 0
    }

    try {
        const gas = await getGasEstimateForMagicContractCall(destinationNetworkId, recipient?.address, transferredAsset)
        return gas
    } catch (err) {
        return FALLBACK_ESTIMATED_GAS[sendFlowParameters.type]
    }
}

async function getGasEstimateForMagicContractCall(
    networkId: NetworkId,
    address: string | undefined,
    transferredAsset: TransferredAsset
): Promise<number> {
    const chain = getNetwork()?.getChain(networkId)
    if (!chain) {
        return Promise.reject('Invalid chain')
    }

    const provider = chain?.getProvider()
    if (!provider) {
        return Promise.reject('Invalid provider')
    }

    if (!address) {
        return Promise.reject('Invalid address')
    }

    const data = getIscpTransferSmartContractData(address, transferredAsset, chain)
    if (!data) {
        return Promise.reject('Invalid data')
    }

    const coinType = chain.getConfiguration().coinType
    const evmAddress = getSelectedAccount()?.evmAddresses?.[coinType]
    return provider.eth.estimateGas({
        from: evmAddress,
        to: ISC_MAGIC_CONTRACT_ADDRESS,
        data,
    })
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
