import { getSelectedAccount } from '@core/account/stores'
import { ETH_COIN_TYPE, getNetwork } from '@core/network'
import { SendFlowParameters, SendFlowType } from '@core/wallet'
import { FALLBACK_GAS_BUDGET, ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import { AssetType } from '../enums'
import { TransferredAsset } from '../types'
import { getIscpTransferSmartContractData } from '../utils'

export async function estimateGasForLayer1ToLayer2Transaction(sendFlowParameters: SendFlowParameters): Promise<number> {
    const { recipient, layer2Parameters } = sendFlowParameters ?? {}

    if (!layer2Parameters) {
        return 0
    }

    const address = layer2Parameters ? layer2Parameters.networkAddress : recipient?.address ?? ''
    const chainId = layer2Parameters.chainId

    const chain = chainId ? getNetwork()?.getChain(chainId) : undefined
    const provider = chain?.getProvider()
    const transferredAsset = getTransferredAsset(sendFlowParameters)

    const fallbackGas = FALLBACK_GAS_BUDGET.toJSNumber()
    if (!chain || !provider || !transferredAsset) {
        return fallbackGas
    }

    try {
        const evmAddress = getSelectedAccount()?.evmAddresses?.[ETH_COIN_TYPE]
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
        const asset = sendFlowParameters.tokenTransfer?.asset
        const amount = sendFlowParameters.tokenTransfer?.rawAmount ?? '0'

        return asset
            ? {
                  type: AssetType.BaseCoin,
                  asset,
                  amount,
              }
            : undefined
    } else {
        const asset = sendFlowParameters.baseCoinTransfer?.asset
        const amount = sendFlowParameters.baseCoinTransfer?.rawAmount ?? '0'

        return asset
            ? {
                  type: AssetType.BaseCoin,
                  asset,
                  amount,
              }
            : undefined
    }
}
