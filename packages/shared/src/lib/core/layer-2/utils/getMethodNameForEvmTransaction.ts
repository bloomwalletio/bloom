import { MethodRegistry } from 'eth-method-registry'
// @ts-ignore
import HttpProvider from '@metamask/ethjs-provider-http'
import { ETHEREUM_MAINNET_NODE } from '../constants'
import { EvmTransactionData } from '../types'

export async function getMethodNameForEvmTransaction(evmTransactionData: EvmTransactionData): Promise<string> {
    const data = String(evmTransactionData.data ?? '')
    const fourBytePrefix = data.substring(0, 10)
    try {
        const provider = new HttpProvider(ETHEREUM_MAINNET_NODE)
        const registry = new MethodRegistry({ provider, network: '1' })
        const result = await registry.lookup(fourBytePrefix)

        const name = result?.split('(')?.[0]
        if (!name) {
            throw Error('Method name could not be found!')
        }

        return camelCaseToReadable(name)
    } catch (error) {
        return fourBytePrefix
    }
}

function camelCaseToReadable(text: string): string {
    text = text[0].toUpperCase() + text.substring(1)
    // Split the text using regular expression to identify camel case boundaries
    const words = text.match(/[A-Z][a-z]*/g) || []

    // Capitalize the first word and join the rest with spaces
    const result = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

    return result
}
