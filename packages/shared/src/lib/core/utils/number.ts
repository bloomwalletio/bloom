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

export function isNumber(str: string): boolean {
    return str.trim() !== '' && !isNaN(+str) && isFinite(+str)
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

export function getSignificantDigitsAndRound(num: number, significantDigits: number = 2): number {
    if (num === 0) {
        return 0
    } else if (num <= 0) {
        throw new Error('Number must be greater than 0.')
    }

    const parts = num.toString().split('.')

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
    const resultStr = `${parts[0]}.${zeros}${digitsForRounding}`

    return parseFloat(resultStr)
}

export function calculatePercentageOfBigInt(total: bigint, max: bigint, precision: number): number {
    if (max === BigInt(0)) {
        return 0
    } else {
        return Number((total * BigInt(10 ** precision)) / max) / 10 ** precision
    }
}
