import { RpcMethod } from '../enums'
import { GENERAL_SUPPORTED_METHODS } from './general-supported-methods.constant'
import { METHODS_FOR_PERMISSION } from './methods-for-permissions.constant'

export const ALL_SUPPORTED_METHODS: RpcMethod[] = [
    ...Object.values(METHODS_FOR_PERMISSION).flat(),
    ...GENERAL_SUPPORTED_METHODS,
]
