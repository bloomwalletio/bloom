import { ParsedMessage } from '@spruceid/siwe-parser'

export function parseSiweMessage(message: string): ParsedMessage | undefined {
    try {
        const parsedMessage = new ParsedMessage(message)

        return parsedMessage
    } catch (error) {
        return undefined
    }
}
