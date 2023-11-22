import { NetworkId } from '@core/network/types'
import { getActiveProfile } from '@core/profile/stores'

export function hasTokenBeenUntracked(tokenAddress: string, networkId: NetworkId): boolean {
    const untrackedTokens = getActiveProfile()?.untrackedTokens ?? {}
    return networkId in untrackedTokens && tokenAddress.toLowerCase() in untrackedTokens[networkId]
}
