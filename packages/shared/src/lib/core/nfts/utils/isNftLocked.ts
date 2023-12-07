import { getTime } from '@core/app/stores'
import { INft } from '../interfaces'
import { isIrc27Nft } from './isIrc27Nft'

export function isNftLocked(nft: INft): boolean {
    if (isIrc27Nft(nft) && nft.timelockTime) {
        return nft.timelockTime > getTime()
    } else {
        return false
    }
}
