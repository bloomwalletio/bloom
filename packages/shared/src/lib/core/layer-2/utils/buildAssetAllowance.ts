import { IIscChain } from '@core/network/interfaces'
import { AssetType } from '../enums'
import { ILayer2AssetAllowance } from '../interfaces'
import { TransferredAsset } from '../types'

export function buildAssetAllowance(
    iscChain: IIscChain,
    transferredAsset: TransferredAsset,
    storageDepositRequired?: bigint
): ILayer2AssetAllowance {
    const baseTokens = String(storageDepositRequired ?? 0)
    if (transferredAsset.type === AssetType.BaseCoin) {
        return {
            baseTokens: iscChain.normaliseAmount(transferredAsset.amount).toString(),
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
