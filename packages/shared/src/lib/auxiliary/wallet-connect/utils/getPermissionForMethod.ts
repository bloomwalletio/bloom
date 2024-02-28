import { METHODS_FOR_PERMISSION } from '../constants'
import { DappPermission, RpcMethod } from '../enums'

export function getPermissionForMethod(method: RpcMethod): DappPermission | undefined {
    for (const permission of Object.values(DappPermission)) {
        const supportedMethods = METHODS_FOR_PERMISSION[permission] ?? []

        if (supportedMethods.includes(method)) {
            return permission
        }
    }

    return undefined
}
