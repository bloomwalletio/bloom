import { IBlockscoutAssetMetadata } from './blockscout-asset-metadata.interface'

// snake_case returned by the API
export interface IBlockscoutAsset {
    token: IBlockscoutAssetMetadata
    token_id: string
    token_instance: unknown
    value: string
}
