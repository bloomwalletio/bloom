import { EvmTransactionData } from '../types'
import featuresObject from '@features/features'
import { lookupMethodSignature } from './lookupMethodSignature'

export async function getMethodNameForEvmTransaction(
    evmTransactionData: EvmTransactionData
): Promise<string | undefined> {
    const data = String(evmTransactionData.data ?? '')
    const fourBytePrefix = data.substring(0, 10)
    try {
        if (!featuresObject.wallet.smartContracts.infuraRegistry.enabled) {
            return fourBytePrefix
        }

        const result = await lookupMethodSignature(fourBytePrefix)

        const name = result?.split('(')?.[0]
        if (!name) {
            throw Error('Method name could not be found!')
        }

        return camelCaseToReadable(name)
    } catch (error) {
        return undefined
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
