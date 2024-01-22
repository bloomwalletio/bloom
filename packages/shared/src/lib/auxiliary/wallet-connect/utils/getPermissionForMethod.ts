import { METHODS_FOR_PERMISSION } from '../constants'
import { DappPermission } from '../enums'

export function getPermissionForMethod(method: string): DappPermission | undefined {
    for (const permission of Object.values(DappPermission)) {
        const supportedMethods = METHODS_FOR_PERMISSION[permission] ?? []

        if (supportedMethods.includes(method)) {
            return permission
        }
    }

    return undefined
}
