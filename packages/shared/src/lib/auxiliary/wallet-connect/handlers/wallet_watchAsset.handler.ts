import { PopupId, closePopup, openPopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { EvmNetworkId } from '@core/network'
import { WCRequestInfo } from '@auxiliary/wallet-connect/types'
import { getEvmTokenMetadata } from '@core/layer-2'
import { getSdkError } from '@walletconnect/utils'
import { addNewTrackedTokenToActiveProfile } from '@core/wallet/actions'
import { TokenStandard, TokenTrackingStatus } from '@core/token/enums'
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

export function handleWatchAsset(params: WatchAssetParams, requestInfo: WCRequestInfo): void {
    const { dapp, evmNetwork, responseCallback } = requestInfo

    if (params.type !== TokenStandard.Erc20 && params.type !== NftStandard.Erc721) {
        responseCallback({ error: getSdkError('UNSUPPORTED_METHODS') })
        return
    }

    openPopup({
        id: PopupId.Confirmation,
        props: {
            title: localize(`popups.confirmAssetTracking.${params.type}.title`),
            description: localize(`popups.confirmAssetTracking.${params.type}.description`, {
                dappName: dapp?.metadata?.name,
                assetName: params.type === TokenStandard.Erc20 ? params.options.name : undefined,
                tokenId: params.type === NftStandard.Erc721 ? params.options.tokenId : undefined,
                address: params.options.address,
            }),
            onConfirm: () => {
                void trackAsset(params, evmNetwork.id)
                responseCallback({ result: null })
                closePopup()
            },
            onCancel: () => {
                responseCallback({ error: getSdkError('USER_REJECTED') })
                closePopup()
            },
        },
    })
}

async function trackAsset(params: WatchAssetParams, networkId: EvmNetworkId): Promise<void> {
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
            addNewTrackedNftToActiveProfile(networkId, persistedNft.id, TokenTrackingStatus.ManuallyTracked)
            break
        }
        default:
            break
    }
}
