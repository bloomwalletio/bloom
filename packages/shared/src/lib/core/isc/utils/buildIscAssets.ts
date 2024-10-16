import { IscAssets } from '@core/isc/types'
import { IIscChain } from '@core/network/interfaces'
import { AssetType } from '../../layer-2/enums'
import { TransferredAsset } from '../../layer-2/types'

export function buildIscAssets(
    iscChain: IIscChain,
    transferredAsset: TransferredAsset,
    storageDepositRequired?: bigint
): IscAssets {
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
                    amount: transferredAsset.amount.toString(),
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
