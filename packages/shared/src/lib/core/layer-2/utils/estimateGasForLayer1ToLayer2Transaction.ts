import { TokenTransactionData, TransactionData, getAddressFromSubject } from '@core/wallet'
import { ETH_COIN_TYPE, getNetwork } from '@core/network'
import { getSelectedAccount } from '@core/account'
import { FALLBACK_GAS_BUDGET, ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import { getIscpTransferSmartContractData } from '../utils'

export async function estimateGasForLayer1ToLayer2Transaction(transactionData: TransactionData): Promise<number> {
    const { recipient, layer2Parameters, rawAssetAmount, asset } = (transactionData as TokenTransactionData) ?? {}

    if (!layer2Parameters) {
        return 0
    }

    const address = layer2Parameters
        ? layer2Parameters.networkAddress
        : recipient
        ? getAddressFromSubject(recipient)
        : ''
    const chainId = layer2Parameters.chainId

    const chain = chainId ? getNetwork()?.getChain(chainId) : undefined
    const provider = chain?.getProvider()

    const fallbackGas = FALLBACK_GAS_BUDGET.toJSNumber()
    if (!asset || !chain || !provider) {
        return fallbackGas
    }

    try {
        const evmAddress = getSelectedAccount()?.evmAddresses?.[ETH_COIN_TYPE]
        const data = getIscpTransferSmartContractData(address, asset, rawAssetAmount, chain)
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
