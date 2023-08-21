import { NetworkId } from '@core/network/types/network-id.type'

export type TrackedTokens = {
    [key in NetworkId]: string[] | undefined
}
