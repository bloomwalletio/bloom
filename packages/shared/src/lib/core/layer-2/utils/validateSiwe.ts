import { ParsedMessage } from '@spruceid/siwe-parser'

export function validateSiwe(siweObject: ParsedMessage, origin: string): boolean {
    if (siweObject.domain !== origin && `https://${siweObject.domain}` !== origin) {
        return false
    }

    return true
}
