import { AssetType } from '../enums'
import { ILayer2AssetAllowance } from '../interfaces'
import { TransferredAsset } from '../types'

export function buildAssetAllowance(transferredAsset: TransferredAsset, gasFee?: number): ILayer2AssetAllowance {
    if (transferredAsset.type === AssetType.Nft) {
        return {
            baseTokens: gasFee ?? '0',
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
            baseTokens: gasFee ?? '0',
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
