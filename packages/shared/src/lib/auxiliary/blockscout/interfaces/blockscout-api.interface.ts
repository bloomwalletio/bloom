import { NftStandard } from '@core/nfts/enums'
import { TokenStandard } from '@core/token/enums'
import { IBlockscoutAsset } from './blockscout-asset.interface'
import { IBlockscoutTokenInfo } from './blockscout-token-info.interface'
import { IBlockscoutTransaction } from './blockscout-transaction.interface'

export interface IBlockscoutApi {
    getAssetMetadata(assetAddress: string): Promise<IBlockscoutTokenInfo | undefined>
    getAssetsForAddress(
        address: string,
        tokenStandard?: TokenStandard.Erc20 | NftStandard.Erc721
    ): Promise<IBlockscoutAsset[]>
    getTransactionsForAddress(address: string): Promise<IBlockscoutTransaction[]>
}
