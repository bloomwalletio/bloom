import { IAuth } from '@iota/sdk/out/types'
import { INodeInfoResponse } from '@core/network/interfaces/node-info-response.interface'
import { getProfileManager } from '../stores'
import { api } from '../api'

export async function getNodeInfo(url?: string, auth?: IAuth): Promise<INodeInfoResponse | undefined> {
    const id = getProfileManager()?.id
    return id ? api.getNodeInfo(id, url, auth) : undefined
}
