import { InvalidTokenIdError } from '@auxiliary/deep-link'
import { DEFAULT_COIN_TYPE } from '@core/network'
import { HEX_PREFIX } from '@core/utils'

export function validateTokenId(id: string): void {
    const isHex = id.startsWith(HEX_PREFIX)
    if (isHex && !/^(0x08)?[0-9a-f]{64}?(?:0[1-9]|[1-5][0-9]|6[0-4])?0{8}$/i.test(id)) {
        throw new InvalidTokenIdError()
    } else if (!isHex && !Object.values(DEFAULT_COIN_TYPE).includes(Number(id))) {
        throw new InvalidTokenIdError()
    }
}
