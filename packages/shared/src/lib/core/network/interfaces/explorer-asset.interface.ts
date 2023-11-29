import { IExplorerAssetMetadata } from './explorer-asset-metadata.interface'

// snake_case returned by the API
export interface IExplorerAsset {
    token: IExplorerAssetMetadata
    token_id: string
    token_instance: unknown
    value: string
}
