export function range(size: number, start: number = 0): number[] {
    if (typeof size !== 'number' || size <= 0) {
        return []
    }

    if (typeof start !== 'number') {
        start = 0
    }

    return Array.from({ length: size }, (_, index) => index + start)
}

export function tryNumberOrZero(numberCandidate: unknown): number {
    if (typeof numberCandidate === 'number' && !Number.isNaN(numberCandidate)) {
        return numberCandidate
    }

    const numberCandidateCasted = Number(numberCandidate)
    return Number.isNaN(numberCandidateCasted) ? 0 : numberCandidateCasted
}

export function isNumberLetterOrPunctuation(key: string): boolean {
    if (typeof key !== 'string' || key.length !== 1) {
        return false
    }

    const code = key.charCodeAt(0)
    const isNumber = code >= 48 && code <= 57
    const isUpperCaseLetter = code >= 65 && code <= 90
    const isLowerCaseLetter = code >= 97 && code <= 122

    return isNumber || isUpperCaseLetter || isLowerCaseLetter
}

export function round(value: number, precision: number = 0): number | null {
    if (typeof value !== 'number' || Number.isNaN(value) || typeof precision !== 'number' || Number.isNaN(precision)) {
        return null
    }

    const multiplier = 10 ** precision
    return Math.round(value * multiplier) / multiplier
}

export function isScientificNotation(num: number | string): boolean {
    return num.toString().includes('e')
}

/**
 * Takes the absolute value of a bigint or a string that represents a bigint.
 * @param bigInt A string or bigint that represents a number.
 * @returns The bytes.
 */
export function BigIntAbs(bigInt: bigint | string): bigint {
    if (typeof bigInt === 'string') {
        bigInt = BigInt(bigInt)
    }
    return bigInt < 0 ? bigInt * BigInt(-1) : bigInt
}

export function divideAndRoundBigInt(dividend: bigint, divisor: bigint, precision: number = 2): string {
    const adjustedDividend = dividend * BigInt(10 ** precision)

    const quotient = adjustedDividend / divisor
    const remainder = adjustedDividend % divisor

    const shouldRoundUp = remainder * BigInt(2) >= divisor

    const roundedQuotient = shouldRoundUp ? quotient + BigInt(1) : quotient

    let result = roundedQuotient.toString()

    if (precision > 0) {
        result = result.padStart(precision + 1, '0')
        const decimalIndex = result.length - precision
        result = result.slice(0, decimalIndex) + '.' + result.slice(decimalIndex)
    }

    result = result.replace(/\.?0+$/, '')

    return result
}

export function getSignificantDigitsAndRound(num: number, significantDigits: number = 2): number {
    if (num >= 1 || num <= 0) {
        throw new Error('Number must be less than 1 and greater than 0.')
    }

    const numStr = num.toString()
    let indexOfFirstSignificantDigit = numStr.indexOf('.') + 1

    while (numStr[indexOfFirstSignificantDigit] === '0') {
        indexOfFirstSignificantDigit++
    }

    let digitsForRounding = numStr.substring(
        indexOfFirstSignificantDigit,
        indexOfFirstSignificantDigit + significantDigits + 1
    )

    if (digitsForRounding.length > significantDigits) {
        let rounded = Math.round(parseInt(digitsForRounding) / 10)
        if (rounded.toString().length > significantDigits) {
            indexOfFirstSignificantDigit -= 1
            rounded = Math.round(rounded / 10)
        }
        digitsForRounding = rounded.toString()
    }

    const zeros = '0'.repeat(indexOfFirstSignificantDigit - numStr.indexOf('.') - 1)
    const resultStr = `0.${zeros}${digitsForRounding}`

    return parseFloat(resultStr)
}
