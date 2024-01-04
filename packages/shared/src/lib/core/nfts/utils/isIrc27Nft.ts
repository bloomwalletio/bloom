import { NftStandard } from '@core/nfts/enums'
import { IIrc27Nft, Nft } from '@core/nfts/interfaces'

export function isIrc27Nft(nft: Nft): nft is IIrc27Nft {
    return nft.standard === NftStandard.Irc27
}
