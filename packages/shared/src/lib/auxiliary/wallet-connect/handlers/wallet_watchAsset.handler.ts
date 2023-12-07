import { PopupId, openPopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { IChain, NetworkId } from '@core/network'
import { CallbackParameters } from '@auxiliary/wallet-connect/types'
import { ContractType, EvmAssetStandard } from '@core/layer-2'
import { getSdkError } from '@walletconnect/utils'
import { addNewTrackedTokenToActiveProfile } from '@core/wallet/actions'
import { TokenStandard, TokenTrackingStatus } from '@core/token/enums'
import { IConnectedDapp } from '../interface'
import { localize } from '@core/i18n'

interface WatchAssetParams {
    type: EvmAssetStandard
    options: {
        address: string
        name?: string
        decimals?: number
        symbol?: string
    }
}

export async function handleWatchAsset(
    params: WatchAssetParams,
    dapp: IConnectedDapp | undefined,
    chain: IChain,
    responseCallback: (params: CallbackParameters) => void
): Promise<void> {
    if (params.type !== 'ERC20' && params.type !== 'ERC721') {
        responseCallback({ error: getSdkError('UNSUPPORTED_METHODS') })
        return
    }

    const assetInfo = await getAssetInfo(params.type, params.options, chain)
    if (!assetInfo) {
        responseCallback({ error: getSdkError('UNSUPPORTED_METHODS') })
        return
    }

    openPopup({
        id: PopupId.Confirmation,
        props: {
            title: localize('popups.confirmAssetTracking.title'),
            description: localize('popups.confirmAssetTracking.description', {
                dappName: dapp?.metadata?.name,
                assetName: assetInfo.name,
            }),
            onConfirm: () => {
                void trackAsset(params.type, params.options.address, assetInfo, chain.getConfiguration().id)
                responseCallback({ result: null })
            },
            onCancel: () => responseCallback({ error: getSdkError('USER_REJECTED') }),
        },
    })
}

async function getAssetInfo(
    type: EvmAssetStandard,
    options: {
        address: string
        name?: string
        decimals?: number
        symbol?: string
    },
    chain: IChain
): Promise<{ name: string; decimals: number; symbol: string } | undefined> {
    switch (type) {
        case 'ERC20': {
            const { address } = options
            const contract = chain.getContract(ContractType.Erc20, address)
            const name = options.name ? options.name : await contract?.methods.name().call()
            const decimals = options.decimals ? options.decimals : await contract?.methods.decimals().call()
            const symbol = options.symbol ? options.symbol : await contract?.methods.symbol().call()

            return { name: name, decimals, symbol }
        }
        case 'ERC721':
            // TODO
            break
        default:
            break
    }
}

function trackAsset(
    type: EvmAssetStandard,
    address: string,
    assetInfo: {
        name: string
        decimals: number
        symbol: string
    },
    networkId: NetworkId
): void {
    switch (type) {
        case 'ERC20':
            addNewTrackedTokenToActiveProfile(
                networkId,
                address,
                { ...assetInfo, standard: TokenStandard.Erc20 },
                TokenTrackingStatus.ManuallyTracked
            )
            break
        case 'ERC721':
            // TODO
            break
        default:
            break
    }
}
