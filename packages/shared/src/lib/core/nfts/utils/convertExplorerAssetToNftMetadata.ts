import { IExplorerAsset } from '@core/network/interfaces'
import { NftStandard } from '../enums'
import { NftMetadata } from '../types'

export function convertExplorerAssetToNftMetadata(asset: IExplorerAsset): NftMetadata | undefined {
    const { token } = asset
    const { name, symbol, type } = token
    return {
        standard: type as NftStandard.Erc721,
        name,
        symbol,
    }
}
