import { getMethodFromRegistry } from '../stores/method-registry.store'
import { DEFAULT_METHOD_REGISTRY } from '../constants/default-method-registry.constant'

export function lookupMethodSignature(fourBytePrefix: string): string | undefined {
    const methodInCache = getMethodFromRegistry(fourBytePrefix)
    if (methodInCache) {
        return methodInCache
    }

    return DEFAULT_METHOD_REGISTRY[fourBytePrefix]
}
