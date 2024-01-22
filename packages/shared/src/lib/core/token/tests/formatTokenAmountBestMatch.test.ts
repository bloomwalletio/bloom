import { formatTokenAmountBestMatch } from '../utils'
import { TokenMetadata } from '../types'
import * as tokenUtils from '../utils/getUnitFromTokenMetadata'
import { appSettings } from '@core/app/stores'

jest.mock('../utils/getUnitFromTokenMetadata', () => ({
    getUnitFromTokenMetadata: jest.fn(),
}))

describe('formatTokenAmountBestMatch', () => {
    const unit = 'BTC'

    beforeEach(() => {
        appSettings.update((state) => ({ ...state, language: 'en' }))
        tokenUtils.getUnitFromTokenMetadata.mockReturnValue(unit)
    })

    test('should return "-" for non-bigint amount', () => {
        expect(formatTokenAmountBestMatch('100', {} as TokenMetadata)).toEqual('-')
        expect(formatTokenAmountBestMatch(100, {} as TokenMetadata)).toEqual('-')
    })

    test('should handle bigint amount without tokenMetadata', () => {
        expect(formatTokenAmountBestMatch(1000n, undefined)).toEqual('1,000 BTC')
    })

    test('should handle bigint amount with tokenMetadata but without decimals', () => {
        const mockTokenMetadata = {} as TokenMetadata
        expect(formatTokenAmountBestMatch(1000n, mockTokenMetadata, true, true)).toEqual('1,000 BTC')
    })

    test('should handle rounding with small decimal amount', () => {
        const mockTokenMetadata = { decimals: 2 } as TokenMetadata
        expect(formatTokenAmountBestMatch(999n, mockTokenMetadata, true, true)).toEqual('9.99 BTC')
    })

    test('should handle rounding with hig decimal amount', () => {
        const mockTokenMetadata = { decimals: 2 } as TokenMetadata
        expect(formatTokenAmountBestMatch(1n, mockTokenMetadata, true, true)).toEqual('0.01 BTC')
    })

    test('should handle no rounding with integer amount', () => {
        const mockTokenMetadata = { decimals: 0 } as TokenMetadata
        expect(formatTokenAmountBestMatch(1234n, mockTokenMetadata, true, false)).toEqual('1,234 BTC')
    })

    test('should format amount correctly with large number of decimals', () => {
        const mockTokenMetadata = { decimals: 18 } as TokenMetadata
        expect(formatTokenAmountBestMatch(123006789123456789n, mockTokenMetadata, true, true)).toEqual('0.123006 BTC')
    })

    test('should return approximate symbol for very small decimals', () => {
        const mockTokenMetadata = { decimals: 18 } as TokenMetadata
        expect(formatTokenAmountBestMatch(1n, mockTokenMetadata, true, true)).toEqual('≈0 BTC')
    })

    test('should handle amount with unit and without rounding', () => {
        const mockTokenMetadata = { decimals: 4 } as TokenMetadata
        const amount = 123456789n
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadata, true, false)).toBe('12,345.6789 BTC')
    })

    test('should handle amount without unit and with rounding', () => {
        const mockTokenMetadata = { decimals: 4 } as TokenMetadata
        const amount = 123456789n
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadata, false, true)).toBe('12,345.6')
    })

    test('should handle very large amounts correctly', () => {
        const mockTokenMetadata = { decimals: 2 } as TokenMetadata
        const amount = 1000000000000000000000n
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadata, true, true)).toEqual(
            '10,000,000,000,000,000,000 BTC'
        )
    })

    test('should handle amounts with maximum decimals', () => {
        const mockTokenMetadata = { decimals: 18 } as TokenMetadata
        const amount = 123456789123456789n
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadata, true, true)).toEqual('0.123456 BTC')
    })

    test('should handle zero amount', () => {
        const mockTokenMetadata = { decimals: 2 } as TokenMetadata
        expect(formatTokenAmountBestMatch(0n, mockTokenMetadata, true, true)).toEqual('0 BTC')
    })

    test('should handle zero amount without unit', () => {
        const mockTokenMetadata = { decimals: 0 } as TokenMetadata
        expect(formatTokenAmountBestMatch(0n, mockTokenMetadata, false, true)).toEqual('0')
    })

    test('should handle amount with no decimals and rounding', () => {
        const mockTokenMetadata = { decimals: 0 } as TokenMetadata
        expect(formatTokenAmountBestMatch(123456789n, mockTokenMetadata, true, true)).toEqual('123,456,789 BTC')
    })

    test('should handle edge case where decimal part is all zeros', () => {
        const mockTokenMetadata = { decimals: 5 } as TokenMetadata
        expect(formatTokenAmountBestMatch(100000n, mockTokenMetadata, true, true)).toEqual('1 BTC')
    })

    test('should handle negative numbers', () => {
        const amount = BigInt(-42069)
        const mockTokenMetadata = { decimals: 1 } as TokenMetadata
        const formattedAmount = formatTokenAmountBestMatch(amount, mockTokenMetadata, false)
        expect(formattedAmount).toBe('-4,206.9')
    })

    test('should return dash if amount is not an integer', () => {
        const amount = 42.069
        const mockTokenMetadata = { decimals: 8 } as TokenMetadata
        // @ts-expect-error
        const formattedAmount = formatTokenAmountBestMatch(amount, mockTokenMetadata, false)
        expect(formattedAmount).toBe('-')
    })

    test('should add correct decimal character for german', () => {
        appSettings.update((state) => ({ ...state, language: 'de' }))
        const amount = BigInt(42000069)
        const mockTokenMetadata = { decimals: 3 } as TokenMetadata
        const formattedAmount = formatTokenAmountBestMatch(amount, mockTokenMetadata, false, false)
        expect(formattedAmount).toBe('42.000,069')
    })

    test('should return dash for big decimal amount', () => {
        const amount = BigInt(4.2e69)
        const mockTokenMetadata = { decimals: 30 } as TokenMetadata
        const formattedAmount = formatTokenAmountBestMatch(amount, mockTokenMetadata, false)
        expect(formattedAmount).toBe('-')
    })

    test('should work with scientific notation and no decimals', () => {
        // e notation will always result in lost precision, since it's a JS representation of floating point numbers
        const amount = BigInt(4.2e69)
        const mockTokenMetadata = { decimals: 0 } as TokenMetadata
        const formattedAmount = formatTokenAmountBestMatch(amount, mockTokenMetadata, false)
        expect(formattedAmount).toBe(
            '4,200,000,000,000,000,304,632,032,802,422,787,529,865,172,520,515,392,213,176,482,653,011,968'
        )
    })

    test('should return the normal string amount if unit is undefined', () => {
        const amount = BigInt(12)
        const mockTokenMetadata = {
            name: 'WEN',
            decimals: 4,
            unit: 'soon',
        } as TokenMetadata
        const formattedAmount = formatTokenAmountBestMatch(amount, mockTokenMetadata, false)
        expect(formattedAmount).toEqual('0.0012')
    })
})
