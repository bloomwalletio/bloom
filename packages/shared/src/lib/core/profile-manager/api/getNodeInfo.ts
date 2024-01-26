import { IAuth } from '@iota/sdk/out/types'
import { INodeInfoResponse } from '@core/network/interfaces/node-info-response.interface'
import { getProfileManager } from '../stores'
import { api } from '../api'

export function getNodeInfo(url?: string, auth?: IAuth): Promise<INodeInfoResponse> | undefined {
    const id = getProfileManager()?.id
    if (id) {
        return api.getNodeInfo(id, url, auth)
    }
}
