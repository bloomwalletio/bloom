import { CoinGeckoCoin } from './coin-gecko-coin.interface'

export interface CoinGeckoCoinShimmerEVM extends CoinGeckoCoin {
    platforms: {
        shimmer_evm: string
    }
}
