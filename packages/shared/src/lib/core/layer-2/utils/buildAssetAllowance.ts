import { AssetType } from '../enums'
import { ILayer2AssetAllowance } from '../interfaces'
import { TransferredAsset } from '../types'

export function buildAssetAllowance(
    transferredAsset: TransferredAsset,
    storageDepositRequired?: number
): ILayer2AssetAllowance {
    const baseTokens = (storageDepositRequired ?? 0).toString()
    if (transferredAsset.type === AssetType.BaseCoin) {
        return {
            baseTokens: String(transferredAsset.amount),
            nativeTokens: [],
            nfts: [],
        }
    } else if (transferredAsset.type === AssetType.Token) {
        return {
            baseTokens,
            nativeTokens: [
                {
                    ID: [transferredAsset.token.id],
                    amount: String(transferredAsset.amount),
                },
            ],
            nfts: [],
        }
    } else {
        return {
            baseTokens: baseTokens,
            nativeTokens: [],
            nfts: [transferredAsset.nft.id],
        }
    }
}
