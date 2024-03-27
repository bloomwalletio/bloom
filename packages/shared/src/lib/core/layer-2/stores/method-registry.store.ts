import { persistent } from '@core/utils/store'
import { get } from 'svelte/store'

export const methodRegistry = persistent<{ [fourBytePrefix: string]: string }>('methodRegistry', {})

export function addMethodToRegistry(fourBytePrefix: string, signature: string): void {
    methodRegistry.update((registry) => {
        registry[fourBytePrefix] = signature
        return registry
    })
}

export function getMethodFromRegistry(fourBytePrefix: string): string | undefined {
    return get(methodRegistry)[fourBytePrefix]
}
