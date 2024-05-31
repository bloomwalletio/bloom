export function isStringTrue(value: string): boolean {
    return value === 'true'
}

export function getByteLengthOfString(str: string): number {
    return new Blob([str]).size
}

/**
 * Strip trailing slashes from the text
 * @param str The text to strip the values from
 * @returns The stripped text
 */
export function stripTrailingSlash(str: string): string {
    return str ? str.replace(/\/+$/, '') : ''
}

export function addTrailingSlash(str: string): string {
    return stripTrailingSlash(str) + '/'
}

/**
 * Strip spaces from the text
 * @param str The text to strip the values from
 * @returns The stripped text
 */
export function stripSpaces(str: string): string {
    return str ? str.replace(/ /g, '') : ''
}

/**
 * Truncate strings
 *
 * @param str: String which has to be truncated
 * @param firstCharCount: Number of characters which has to be shown as first portion. Default = 5
 * @param endCharCount: Number of characters which has to be shown at end portion. Default = 5
 * @param dotCount: Count of dots in between first and end portion. Default = 3
 */

export function truncateString(
    str: string = '',
    firstCharCount: number = 5,
    endCharCount: number = 5,
    dotCount: number = 3
): string {
    const maxLength = firstCharCount + endCharCount + dotCount
    if (!str || str.length <= maxLength) {
        return str
    }
    let convertedStr = ''
    convertedStr += str.substring(0, firstCharCount)
    convertedStr += '.'.repeat(dotCount)
    convertedStr += str.substring(str.length - endCharCount, str.length)
    return convertedStr
}

/**
 * Extract initials from string
 */
export function getInitials(name: string | undefined, maxChars?: number): string {
    if (!name || !name.trim() || (maxChars && maxChars < 0)) {
        return ''
    }

    // Extract initial characters of each word, considering emojis and ignoring other symbols
    // eslint-disable-next-line security/detect-unsafe-regex
    const regexEmoji = /\p{Emoji}\uFE0F?(?:\u200D\p{Emoji}\uFE0F?)*/gu
    const regexLetterOrNumber = /[\p{L}\p{N}]/gu
    const initialsArray = name
        .split(' ')
        .filter((word) => word)
        .map((word) => {
            if (regexEmoji.test(word) && !regexLetterOrNumber.test(word)) {
                // Reset lastIndex because the global flag is set on the regex
                regexEmoji.lastIndex = 0
                const emojiMatch = word.match(regexEmoji)
                return emojiMatch ? emojiMatch[0] : ''
            } else {
                // Get the first letter or number ignoring other symbols
                const initialMatch = word.match(regexLetterOrNumber)
                return initialMatch ? initialMatch[0] : ''
            }
        })
        .filter(Boolean) // Filter out empty strings

    // Limit the number of initials if maxChars is provided
    if (maxChars !== undefined) {
        return initialsArray.slice(0, maxChars).join('').toUpperCase()
    }

    return initialsArray.join('').toUpperCase()
}

/**
 * Get the length of a string after it has been trimmed supporting emojis
 * @param name The string to get the length of
 * @returns
 */
export function getTrimmedLength(name: string | undefined): number {
    if (!name) {
        return 0
    }

    return name.trim().match(/./gu)?.length ?? 0
}

export function getNthOccurrenceIndex(string: string, char: string, n: number): number {
    let index = -1
    while (n-- && index++ < string.length) {
        index = string.indexOf(char, index)
        if (index < 0) break
    }
    return index
}

export function convertCamelCaseToPhrase(text: string): string {
    if (text.length === 0) {
        return ''
    }
    text = text[0].toUpperCase() + text.substring(1)
    // Split the text using regular expression to identify camel case boundaries
    const words = text.match(/[A-Z][a-z]*/g) || []

    // Capitalize the first word and join the rest with spaces
    const result = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

    return result
}
