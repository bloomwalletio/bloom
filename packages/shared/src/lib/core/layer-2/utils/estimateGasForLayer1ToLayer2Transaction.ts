import { TokenTransactionData, TransactionData, getAddressFromSubject } from '@core/wallet'
import { GAS_BUDGET, ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import { getNetwork } from '@core/network'
import { handleError } from '@core/error/handlers'
import { IError } from '@core/error'
import { getIscpTransferSmartContractData } from '@core/layer-2/utils'

export async function estimateGasForLayer1ToLayer2Transaction(transactionData: TransactionData): Promise<number> {
    const { recipient, layer2Parameters, rawAmount, asset } = (transactionData as TokenTransactionData) ?? {}

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

    const fallbackGas = GAS_BUDGET.toJSNumber()
    if (!asset || !chain || !provider) {
        return fallbackGas
    }

    try {
        const data = getIscpTransferSmartContractData(address, asset, rawAmount, chain)
        if (data) {
            const gas = await provider.eth.estimateGas({
                from: '0xfAeE0E0A64D6dC1cf64634d086c7C355250597aE',
                to: ISC_MAGIC_CONTRACT_ADDRESS,
                data,
            })
            return gas
        } else {
            return Promise.resolve(fallbackGas)
        }
    } catch (err) {
        handleError(err as IError)
        return Promise.resolve(fallbackGas)
    }
}
