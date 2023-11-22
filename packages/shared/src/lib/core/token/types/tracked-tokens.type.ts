import { NetworkId } from '@core/network/types'
import { TokenTrackingStatus } from '../enums'

export type TrackedTokens = {
    [key in NetworkId]?: Record<string, TokenTrackingStatus>
}
