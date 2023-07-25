import { IClientOptions, CoinType, SecretManagerType } from '@iota/sdk'

import { generateRandomId } from '@core/utils'

import { api } from '../api'
import { IProfileManager } from '../interfaces'

export async function initialiseProfileManager(
    storagePath: string,
    coinType: CoinType,
    clientOptions?: IClientOptions,
    secretManager?: SecretManagerType,
    id?: string
): Promise<IProfileManager> {
    id = id ?? generateRandomId()

    const profileManager = await api.createAccountManager(id, {
        storagePath,
        ...(clientOptions &&
            ((clientOptions?.nodes && clientOptions?.nodes?.length > 0) || clientOptions?.primaryNode) && {
                clientOptions,
            }),
        coinType,
        ...(secretManager && { secretManager }),
    })
    return profileManager
}
