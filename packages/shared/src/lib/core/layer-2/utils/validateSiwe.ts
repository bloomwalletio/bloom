import { ParsedMessage } from '@spruceid/siwe-parser'

export function validateSiwe(siweObject: ParsedMessage, origin: string | undefined): boolean {
    if (siweObject.domain !== origin && `https://${siweObject.domain}` !== origin) {
        return false
    }

    return true
}
