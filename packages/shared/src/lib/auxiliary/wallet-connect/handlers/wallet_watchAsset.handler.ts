import { PopupId, openPopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { IChain } from '@core/network'
import { CallbackParameters } from '@auxiliary/wallet-connect/types'
import { ContractType } from '@core/layer-2'
import { getSdkError } from '@walletconnect/utils'
import { addNewTrackedTokenToActiveProfile } from '@core/wallet/actions'
import { TokenStandard, TokenTrackingStatus } from '@core/token/enums'
import { IConnectedDapp } from '../interface'

interface WatchAssetParams {
    type: 'ERC20' | 'ERC721'
    options: {
        address: string
        name?: string
        decimals?: number
        symbol?: string
    }
}

export function handleWatchAsset(
    params: WatchAssetParams,
    dapp: IConnectedDapp | undefined,
    chain: IChain,
    responseCallback: (params: CallbackParameters) => void
): void {
    if (params.type !== 'ERC20' && params.type !== 'ERC721') {
        responseCallback({ error: getSdkError('UNSUPPORTED_METHODS') })
        return
    }

    openPopup({
        id: PopupId.Confirmation,
        props: {
            title: '',
            description: '',
            onConfirm: () => {
                void trackAsset(params.type, params.options, chain)
                responseCallback({ result: null })
            },
            onCancel: () => responseCallback({ error: getSdkError('USER_REJECTED') }),
        },
    })
}

async function trackAsset(
    type: 'ERC20' | 'ERC721',
    options: {
        address: string
        name?: string
        decimals?: number
        symbol?: string
    },
    chain: IChain
): Promise<void> {
    switch (type) {
        case 'ERC20': {
            const { address } = options
            const contract = chain?.getContract(ContractType.Erc20, address)
            const name = options.name ? options.name : await contract?.methods.name().call()
            const decimals = options.decimals ? options.decimals : await contract?.methods.decimals().call()
            const symbol = options.symbol ? options.symbol : await contract?.methods.symbol().call()

            addNewTrackedTokenToActiveProfile(
                chain.getConfiguration().id,
                address,
                { name, symbol, decimals, standard: TokenStandard.Erc20 },
                TokenTrackingStatus.ManuallyTracked
            )
            break
        }
        case 'ERC721':
            // TODO
            break
        default:
            break
    }
}
