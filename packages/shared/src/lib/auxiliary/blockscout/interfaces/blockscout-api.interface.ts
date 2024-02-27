import { NftStandard } from '@core/nfts/enums'
import { TokenStandard } from '@core/token/enums'
import { IBlockscoutAsset } from './blockscout-asset.interface'
import { IBlockscoutAssetMetadata } from './blockscout-asset-metadata.interface'
import { IBlockscoutTransaction } from './blockscout-transaction.interface'

export interface IBlockscoutApi {
    getAssetMetadata(assetAddress: string): Promise<IBlockscoutAssetMetadata | undefined>
    getAssetsForAddress(
        address: string,
        tokenStandard?: TokenStandard.Erc20 | NftStandard.Erc721
    ): Promise<IBlockscoutAsset[]>
    getTransactionsForAddress(address: string): Promise<IBlockscoutTransaction[]>
}
