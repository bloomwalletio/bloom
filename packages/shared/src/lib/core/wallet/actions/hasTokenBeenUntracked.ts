import { NetworkId } from '@core/network/types'
import { getActiveProfile } from '@core/profile/stores'
import { TokenTrackingStatus } from '@core/token/enums'

export function hasTokenBeenUntracked(tokenAddress: string, networkId: NetworkId): boolean {
    const untrackedTokens = getActiveProfile()?.trackedTokens?.[networkId] ?? {}
    return untrackedTokens?.[tokenAddress] === TokenTrackingStatus.Untracked
}
