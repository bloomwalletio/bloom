import { persistent } from '@core/utils/store'

export const methodRegistry = persistent<{ [fourBytePrefix: string]: string }>('methodRegistry', {})

export function addMethodToRegistry(fourBytePrefix: string, signature: string): void {
    methodRegistry.update((registry) => {
        registry[fourBytePrefix] = signature
        return registry
    })
}
