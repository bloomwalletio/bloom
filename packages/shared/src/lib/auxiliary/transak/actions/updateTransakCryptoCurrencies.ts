import { TransakApi } from '../apis'
import { TransakCryptoCurrency, transakCryptoCurrencies } from '../stores'

export async function updateTransakCryptoCurrencies(): Promise<void> {
    // TODO: dynamically generate list of allowed names
    const allowedNetworkNames = ['miota', 'ethereum']
    const allowedNetworkChainIds = ['1']

    const api = new TransakApi()
    const response = await api.getFilteredCryptoCurrencies(allowedNetworkNames, allowedNetworkChainIds)

    transakCryptoCurrencies.set(
        response?.reduce((acc, token) => {
            if (!token.isAllowed) {
                return acc
            }

            return [
                ...acc,
                {
                    name: token.name,
                    symbol: token.symbol,
                    image: {
                        thumb: token.image.thumb,
                        small: token.image.small,
                        large: token.image.large,
                    },
                    networkName: token.network.name,
                    chainId: token.network.chainId,
                    decimals: token.decimals,
                },
            ]
        }, [] as TransakCryptoCurrency[])
    )
}
