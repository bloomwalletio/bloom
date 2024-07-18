import {
    NetworkId,
    NetworkNamespace,
    StardustNetworkId,
    SupportedStardustNetworkId,
    getEvmNetworks,
    getNetwork,
    getStardustNetwork,
} from '@core/network'
import { TransakApi } from '../apis'
import { ITransakApiCryptoCurrenciesResponseItem } from '../interfaces'
import { TransakCryptoCurrency, transakCryptoCurrencies } from '../stores'
import { AppStage } from '@core/app'

const STARDUST_NETWORK_ID_TO_TRANSAK_NETWORK_NAME_MAP: Record<StardustNetworkId, string> = {
    ...(process.env.STAGE === AppStage.PROD
        ? { [SupportedStardustNetworkId.Iota]: 'miota' }
        : { [SupportedStardustNetworkId.IotaTestnet]: 'miota' }),
}

export async function updateTransakCryptoCurrencies(): Promise<void> {
    const stardustNetwork = getStardustNetwork()
    const transakNetworkNameForStardustNetwork = STARDUST_NETWORK_ID_TO_TRANSAK_NETWORK_NAME_MAP[stardustNetwork.id]
    const evmNetworks = getEvmNetworks()

    const allowedNetworkNames = [transakNetworkNameForStardustNetwork]
    const allowedNetworkChainIds = evmNetworks.map((network) => network.chainId)

    const api = new TransakApi()
    const response = await api.getFilteredCryptoCurrencies(allowedNetworkNames, allowedNetworkChainIds)

    // sort response by stardust network first and then by order of evm networks
    response?.sort((a, b) => {
        const aNetworkId = getNetworkIdFromTransakNetwork(a.network.name, a.network.chainId)
        const bNetworkId = getNetworkIdFromTransakNetwork(b.network.name, b.network.chainId)
        if (aNetworkId === stardustNetwork.id) {
            return -1
        } else if (bNetworkId === stardustNetwork.id) {
            return 1
        } else {
            return evmNetworks.findIndex((network) => network.id === aNetworkId) <
                evmNetworks.findIndex((network) => network.id === bNetworkId)
                ? -1
                : 1
        }
    })

    transakCryptoCurrencies.set(
        response?.reduce((acc, token) => {
            if (!token.isAllowed) {
                return acc
            }

            return [...acc, buildTransakCryptoCurrencyFromResponseItem(token)]
        }, [] as TransakCryptoCurrency[])
    )
}

function buildTransakCryptoCurrencyFromResponseItem(
    responseItem: ITransakApiCryptoCurrenciesResponseItem
): TransakCryptoCurrency {
    const networkId = getNetworkIdFromTransakNetwork(responseItem.network.name, responseItem.network.chainId)
    const network = getNetwork(networkId)
    if (!network) {
        throw new Error(`Unsupported Transak network: ${responseItem.network.name}`)
    }
    return {
        name: responseItem.name,
        symbol: responseItem.symbol,
        image: {
            thumb: responseItem.image.thumb,
            small: responseItem.image.small,
            large: responseItem.image.large,
        },
        network,
        transakNetworkName: responseItem.network.name,
        decimals: responseItem.decimals,
    }
}

function getNetworkIdFromTransakNetwork(transakNetworkName: string, chainId: string | null | undefined): NetworkId {
    if (transakNetworkName === 'miota') {
        return process.env.STAGE === AppStage.PROD
            ? SupportedStardustNetworkId.Iota
            : SupportedStardustNetworkId.IotaTestnet
    } else if (chainId) {
        return `${NetworkNamespace.Evm}:${chainId}`
    } else {
        throw new Error(`Unsupported Transak network: ${transakNetworkName}`)
    }
}
