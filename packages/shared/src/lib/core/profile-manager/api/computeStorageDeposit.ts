import { nodeInfo } from '@core/network'
import { api } from '@core/profile-manager'
import type { Output } from '@iota/sdk'
import { get } from 'svelte/store'

export function computeStorageDeposit(output: Output): Promise<string> {
    const rent = get(nodeInfo)?.protocol?.rentStructure
    if (!rent) {
        throw new Error('Protocol parameters are undefined')
    } else {
        return api.computeStorageDeposit(output, rent)
    }
}
