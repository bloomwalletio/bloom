import { getTime } from '@core/app/stores'
import { Nft } from '../interfaces'
import { isIrc27Nft } from './isIrc27Nft'

export function isNftLocked(nft: Nft): boolean {
    if (isIrc27Nft(nft) && nft.timelockTime) {
        return nft.timelockTime > getTime()
    } else {
        return false
    }
}
