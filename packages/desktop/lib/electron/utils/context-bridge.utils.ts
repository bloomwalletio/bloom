import * as IotaSdk from '@iota/sdk'
/**
 * Binds objects for exposing to the renderer process through the context bridge. Be careful
 * if exposing a static class.
 */
export function bindMethodsAcrossContextBridge<O>(prototype: unknown, object: O): O {
    const prototypeProperties = Object.getOwnPropertyNames(prototype)
    prototypeProperties.forEach((property) => {
        if (property !== 'constructor') {
            object[property] = object[property].bind(object)
        }
    })
    return object
}

export function bindSdkUtilsMethods(): IotaSdk.Utils {
    const methodNames = Object.getOwnPropertyNames(IotaSdk.Utils).filter(
        (m) => !['length', 'name', 'prototype'].includes(m)
    )
    const methods = {}

    for (const name of methodNames) {
        methods[name] = (...args) => IotaSdk.Utils[name](...args)
    }

    return methods
}
