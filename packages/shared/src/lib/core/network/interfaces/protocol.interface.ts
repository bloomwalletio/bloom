import type { IRent } from '@iota/sdk/out/types'

export interface IProtocol {
    version: number
    networkName: string
    bech32Hrp: string
    minPowScore: number
    belowMaxDepth?: number
    rentStructure: IRent
    tokenSupply: string
}
