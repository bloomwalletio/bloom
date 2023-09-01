import { HEXADECIMAL_PREFIX } from '@core/utils/constants'

export function isValidHexAddress(text: string): boolean {
    const isHex = text.startsWith(HEXADECIMAL_PREFIX)
    return isHex && /^(0x)?[0-9a-f]{64}/i.test(text)
}
