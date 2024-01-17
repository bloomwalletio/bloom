import { PopupId, openPopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { IChain, NetworkId } from '@core/network'
import { CallbackParameters } from '@auxiliary/wallet-connect/types'
import { getEvmTokenMetadata } from '@core/layer-2'
import { getSdkError } from '@walletconnect/utils'
import { addNewTrackedTokenToActiveProfile } from '@core/wallet/actions'
import { TokenStandard, TokenTrackingStatus } from '@core/token/enums'
import { IConnectedDapp } from '../interface'
import { localize } from '@core/i18n'
import { NftStandard } from '@core/nfts/enums'
import { addNewTrackedNftToActiveProfile, persistErc721Nft } from '@core/nfts/actions'
import { IErc20Metadata } from '@core/token'

type WatchAssetParams =
    | {
          type: TokenStandard.Erc20
          options: {
              address: string
              name?: string
              decimals?: number
              symbol?: string
          }
      }
    | {
          type: NftStandard.Erc721
          options: {
              address: string
              tokenId: string
          }
      }

export function handleWatchAsset(
    params: WatchAssetParams,
    dapp: IConnectedDapp | undefined,
    chain: IChain,
    responseCallback: (params: CallbackParameters) => void
): void {
    if (params.type !== TokenStandard.Erc20 && params.type !== NftStandard.Erc721) {
        responseCallback({ error: getSdkError('UNSUPPORTED_METHODS') })
        return
    }

    const assetName = params.type === TokenStandard.Erc20 ? params.options.name : params.options.tokenId

    openPopup({
        id: PopupId.Confirmation,
        props: {
            title: localize('popups.confirmAssetTracking.title'),
            description: localize('popups.confirmAssetTracking.description', {
                dappName: dapp?.metadata?.name,
                assetName: assetName ?? params.options.address,
            }),
            onConfirm: () => {
                void trackAsset(params, chain.getConfiguration().id)
                responseCallback({ result: null })
            },
            onCancel: () => responseCallback({ error: getSdkError('USER_REJECTED') }),
        },
    })
}

async function trackAsset(params: WatchAssetParams, networkId: NetworkId): Promise<void> {
    const { type, options } = params
    switch (type) {
        case TokenStandard.Erc20: {
            const erc20TokenMetadata = await getEvmTokenMetadata(options.address, networkId)
            if (!erc20TokenMetadata) {
                return
            }
            addNewTrackedTokenToActiveProfile(
                networkId,
                options.address,
                erc20TokenMetadata as IErc20Metadata,
                TokenTrackingStatus.ManuallyTracked
            )
            break
        }
        case NftStandard.Erc721: {
            const persistedNft = await persistErc721Nft(options.address, options.tokenId, networkId)
            if (!persistedNft) {
                return
            }
            addNewTrackedNftToActiveProfile(
                networkId,
                `${persistedNft.contractMetadata.address}:${persistedNft.tokenId}`,
                TokenTrackingStatus.ManuallyTracked
            )
            break
        }
        default:
            break
    }
}
