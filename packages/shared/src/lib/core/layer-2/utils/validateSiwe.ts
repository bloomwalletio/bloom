import { ParsedMessage } from '@spruceid/siwe-parser'

export function validateSiwe(siweObject: ParsedMessage, origin: string | undefined): boolean {
    // if localhost is the domain of the dapp, allow it
    const potentialDomains = [
        siweObject.domain,
        `https://${siweObject.domain}`,
        `https://${siweObject.domain}/`,
        `${siweObject.domain}/`,
    ]

    if (origin && potentialDomains.includes(origin.toString())) {
        return true
    }

    return false
}
