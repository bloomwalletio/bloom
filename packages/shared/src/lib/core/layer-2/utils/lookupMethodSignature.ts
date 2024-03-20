import features from '@features/features'
import Web3 from 'web3'
import { REGISTRY_ABI } from '../abis/registry.abi'
import { ETHEREUM_MAINNET_NODE } from '../constants'
import { REGISTRY_CONTRACT_ADDRESS } from '../constants/registry-contract-address.constant'
import { addMethodToRegistry, getMethodFromRegistry } from '../stores/method-registry.store'

const provider = new Web3(ETHEREUM_MAINNET_NODE)
const registry = new provider.eth.Contract(REGISTRY_ABI, REGISTRY_CONTRACT_ADDRESS)

export async function lookupMethodSignature(fourBytePrefix: string): Promise<string | undefined> {
    const method = getMethodFromRegistry(fourBytePrefix)
    if (method) {
        return method
    }

    if (features.wallet.smartContracts.infuraRegistry.enabled) {
        try {
            const result = await registry.methods.entries(fourBytePrefix).call()
            if (result) {
                addMethodToRegistry(fourBytePrefix, result)
                return result
            } else {
                return undefined
            }
        } catch (error) {
            return undefined
        }
    }
}
