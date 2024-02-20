import Web3 from 'web3'
import { REGISTRY_ABI } from '../abis/registry.abi'
import { ETHEREUM_MAINNET_NODE } from '../constants'
import { REGISTRY_CONTRACT_ADDRESS } from '../constants/registry-contract-address.constant'
import { get } from 'svelte/store'
import { addMethodToRegistry, methodRegistry } from '../stores/method-registry.store'

const provider = new Web3(ETHEREUM_MAINNET_NODE)
const registry = new provider.eth.Contract(REGISTRY_ABI, REGISTRY_CONTRACT_ADDRESS)

export async function lookupMethodSignature(fourBytePrefix: string): Promise<string | undefined> {
    const methodName = get(methodRegistry)[fourBytePrefix]
    if (methodName) {
        return methodName
    }

    try {
        const result = await registry.methods.entries(fourBytePrefix).call()
        if (!result) {
            return undefined
        }

        addMethodToRegistry(fourBytePrefix, result)
        return result
    } catch (error) {
        return undefined
    }
}
