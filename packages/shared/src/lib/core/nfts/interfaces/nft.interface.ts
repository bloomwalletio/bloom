import { Address } from '@iota/sdk'
import { NftDownloadMetadata, IIrc27Metadata } from '../interfaces'

export interface INft {
    id: string
    chainId?: number
    address: string
    name: string
    metadata?: string
    issuer?: Address
    parsedMetadata?: IIrc27Metadata
    isSpendable: boolean
    timelockTime: number
    latestOutputId: string
    composedUrl: string
    downloadUrl: string
    storageDeposit: number
    filePath: string
    downloadMetadata: NftDownloadMetadata
}
