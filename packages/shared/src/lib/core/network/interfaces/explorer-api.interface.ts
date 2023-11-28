import { TokenStandard } from '@core/token/enums'
import { IExplorerAsset } from './explorer-asset.interface'
import { IExplorerAssetMetadata } from './explorer-asset-metadata.interface'

export interface IExplorerApi {
    getAssetMetadata(assetAddress: string): Promise<IExplorerAssetMetadata | undefined>
    getAssetsForAddress(address: string, tokenStandard?: TokenStandard): Promise<IExplorerAsset[]>
}
