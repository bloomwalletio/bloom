import { IAuth } from '@core/network'
import { INodeInfoResponse } from '@core/network/interfaces/node-info-response.interface'
import { api } from '../api'
import { getProfileManager } from '../stores'

export function getNodeInfo(url?: string, auth?: IAuth): Promise<INodeInfoResponse> {
    const manager = getProfileManager()
    return api.getNodeInfo(manager.id, url, auth)
}
