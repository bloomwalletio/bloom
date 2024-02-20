import { getDecimalSeparator } from './getDecimalSeparator'
import { getGroupSeparator } from './getGroupSeparator'

export function parseCurrency(
    valueString: string | undefined,
    currency: string | undefined = undefined
): string | undefined {
    // Need to escape the character in the regex in case it is . otherwise it will replace all characters
    let v = valueString?.replace(new RegExp(`\\${getGroupSeparator()}`, 'g'), '')
    v = v?.replace(getDecimalSeparator(currency), '.')
    const parsedAmount = v?.startsWith('.') ? '0'.concat(v) : v
    return isNaN(Number(parsedAmount)) ? '0' : parsedAmount
}
