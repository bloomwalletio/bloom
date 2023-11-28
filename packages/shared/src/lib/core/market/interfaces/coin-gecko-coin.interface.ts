import { CoinGeckoNetworkId } from '../enums'
import { CoinGeckoCoinImage } from './coin-gecko-coin-image.interface'

export interface CoinGeckoCoin {
    id: string
    symbol: string
    name: string
    platforms: Record<CoinGeckoNetworkId, string>
    image?: CoinGeckoCoinImage
}
