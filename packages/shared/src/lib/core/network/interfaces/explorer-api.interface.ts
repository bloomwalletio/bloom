import { TokenStandard } from '@core/token/enums'

export interface IExplorerApi {
    getAssetMetadata(assetAddress: string): Promise<unknown>
    getAssetsForAddress(address: string, tokenStandards?: TokenStandard[]): Promise<unknown>
}
