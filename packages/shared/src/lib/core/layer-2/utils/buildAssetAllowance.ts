import { AssetType } from '../enums'
import { IAssetAllowance } from '../interfaces'
import { TransferredAsset } from '../types'

export function buildAssetAllowance(transferredAsset: TransferredAsset): IAssetAllowance {
    if (transferredAsset.type === AssetType.Nft) {
        return {
            baseTokens: '0',
            nativeTokens: [],
            nfts: [transferredAsset.nft.id],
        }
    } else if (transferredAsset.type === AssetType.BaseCoin) {
        return {
            baseTokens: transferredAsset.amount,
            nativeTokens: [],
            nfts: [],
        }
    } else {
        return {
            baseTokens: '0',
            nativeTokens: [
                {
                    ID: [transferredAsset.token.id],
                    amount: transferredAsset.amount,
                },
            ],
            nfts: [],
        }
    }
}
