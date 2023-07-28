import { AssetType } from '../enums'
import { ILayer2AssetAllowance } from '../interfaces'
import { TransferredAsset } from '../types'

export function getLayer2AssetAllowance(transferredAsset: TransferredAsset): ILayer2AssetAllowance {
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
                    ID: [transferredAsset.asset.id],
                    amount: transferredAsset.amount,
                },
            ],
            nfts: [],
        }
    }
}
