import { NetworkId } from '../types'

export type TrackedTokens = {
    [key in NetworkId]: string[] | undefined
}
