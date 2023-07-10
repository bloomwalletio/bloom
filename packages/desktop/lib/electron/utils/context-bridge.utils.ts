/**
 * Binds objects for exposing to the renderer process through the context bridge. Be careful
 * if exposing a static class.
 */
export function bindObjectAcrossContextBridge<O>(prototype: unknown, object: O): O {
    const prototypeProperties = Object.getOwnPropertyNames(prototype)
    prototypeProperties.forEach((property) => {
        if (property !== 'constructor') {
            object[property] = object[property].bind(object)
        }
    })
    return object
}
