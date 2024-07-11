import { NetworkId, NetworkNamespace, SupportedStardustNetworkId, getNetwork } from '@core/network'
import { TransakApi } from '../apis'
import { ITransakApiCryptoCurrenciesResponseItem } from '../interfaces'
import { TransakCryptoCurrency, transakCryptoCurrencies } from '../stores'

export async function updateTransakCryptoCurrencies(): Promise<void> {
    // TODO: dynamically generate list of allowed names
    const allowedNetworkNames = ['ethereum']
    const allowedNetworkChainIds = ['1']

    const api = new TransakApi()
    const response = await api.getFilteredCryptoCurrencies(allowedNetworkNames, allowedNetworkChainIds)

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
        decimals: responseItem.decimals,
    }
}

function getNetworkIdFromTransakNetwork(transakNetworkName: string, chainId: string | null | undefined): NetworkId {
    if (transakNetworkName === 'miota') {
        return SupportedStardustNetworkId.Iota
    } else if (chainId) {
        return `${NetworkNamespace.Evm}:${chainId}`
    } else {
        throw new Error(`Unsupported Transak network: ${transakNetworkName}`)
    }
}
