import { DEFAULT_NETWORK_METADATA, NetworkId } from '@core/network'
import { api } from '@core/profile-manager'
import type { Output } from '@iota/sdk'

export function computeStorageDeposit(output: Output, networkId: NetworkId): Promise<string> {
    // TODO: get this from protocol parameters returned by node
    const rent = DEFAULT_NETWORK_METADATA?.[networkId]?.protocol.rentStructure
    if (!rent) {
        throw new Error('Protocol parameters are undefined')
    } else {
        return api.computeStorageDeposit(output, rent)
    }
}
