import { CoinGeckoCoinImage } from './coin-gecko-coin-image.interface'

export interface CoinGeckoCoin {
    id: string
    symbol: string
    name: string
    platforms: {
        shimmer_evm?: string
    }
    image?: CoinGeckoCoinImage
}
