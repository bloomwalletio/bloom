import { NftStandard } from '@core/nfts/enums'
import { IIrc27Nft, INft } from '@core/nfts/interfaces'

export function isIrc27Nft(nft: INft): nft is IIrc27Nft {
    return nft.standard === NftStandard.Irc27
}
