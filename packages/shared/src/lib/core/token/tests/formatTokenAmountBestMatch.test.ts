import { formatTokenAmountBestMatch } from '../utils'
import { TokenMetadata } from '../types'
import * as i18n from '@core/i18n'
import * as utils from '@core/utils'
import * as tokenUtils from '../utils/getUnitFromTokenMetadata'

jest.mock('@core/i18n', () => ({
    ...jest.requireActual('@core/i18n'),
    formatNumber: jest.fn(),
    getDecimalSeparator: jest.fn(),
}))

jest.mock('@core/utils', () => ({
    ...jest.requireActual('@core/utils'),
    isDecimal: jest.fn(),
}))

jest.mock('../utils/getUnitFromTokenMetadata', () => ({
    getUnitFromTokenMetadata: jest.fn(),
}))

describe('formatTokenAmountBestMatch', () => {
    const mockTokenMetadata = { decimals: 2 } as TokenMetadata

    test('should throw an error for negative amount', () => {
        expect(() => formatTokenAmountBestMatch(-1, mockTokenMetadata)).toThrow('Amount is negative')
    })

    test('should throw an error for amount exceeding max safe integer', () => {
        expect(() => formatTokenAmountBestMatch(Number.MAX_SAFE_INTEGER + 1, mockTokenMetadata)).toThrow(
            'Amount is too large to be formatted'
        )
    })

    test('should throw an error for decimal amount', () => {
        utils.isDecimal.mockImplementation((amount) => amount % 1 !== 0)
        expect(() => formatTokenAmountBestMatch(1.234, mockTokenMetadata)).toThrow('Amount is a decimal number')
    })

    test('should return formatted zero for NaN amount', () => {
        expect(formatTokenAmountBestMatch(NaN, mockTokenMetadata)).toBe('0')
    })

    test('should format integer amount without unit and without rounding', () => {
        const amount = 1000
        i18n.formatNumber.mockReturnValue('1,000')
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadata, false, false)).toBe('1,000')
    })

    test('should format integer amount with unit but without rounding', () => {
        const amount = 1000
        const unit = 'Token'
        tokenUtils.getUnitFromTokenMetadata.mockReturnValue(unit)
        i18n.formatNumber.mockReturnValue('1,000')
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadata, true, false)).toBe('1,000 Token')
    })

    test('should format small decimal amount with unit and rounding', () => {
        const amount = 123
        const unit = 'Token'
        tokenUtils.getUnitFromTokenMetadata.mockReturnValue(unit)
        i18n.formatNumber.mockReturnValue('1.23')
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadata, true, true)).toBe('1.23 Token')
    })

    test('should format large decimal amount with unit and rounding', () => {
        const amount = 123456789
        const unit = 'Token'
        tokenUtils.getUnitFromTokenMetadata.mockReturnValue(unit)
        i18n.formatNumber.mockReturnValue('1,234,567.89')
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadata, true, true)).toBe('1,234,567.89 Token')
    })

    test('should format decimal amount with maximum length', () => {
        const amount = 123456789012
        const unit = 'Token'
        tokenUtils.getUnitFromTokenMetadata.mockReturnValue(unit)
        i18n.formatNumber.mockReturnValue('1,234,567,890.12')
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadata, true, true)).toBe('1,234,567,890.12 Token')
    })

    test('should format decimal amount exceeding maximum length', () => {
        const amount = 1234567890123
        const unit = 'Token'
        tokenUtils.getUnitFromTokenMetadata.mockReturnValue(unit)
        i18n.formatNumber.mockReturnValue('≈12,345,678,901.23')
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadata, true, true)).toBe('≈12,345,678,901.23 Token')
    })

    test('should format amount with different decimal places in token metadata', () => {
        const amount = 12345
        const mockTokenMetadataVariedDecimals = { ...mockTokenMetadata, decimals: 4 }
        const unit = 'Token'
        tokenUtils.getUnitFromTokenMetadata.mockReturnValue(unit)
        i18n.formatNumber.mockReturnValue('0.1235')
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadataVariedDecimals, true, true)).toBe('0.1235 Token')
    })

    test('should not format very large integer amount', () => {
        const amount = 987654321012345678
        const unit = 'Token'
        tokenUtils.getUnitFromTokenMetadata.mockReturnValue(unit)
        i18n.formatNumber.mockReturnValue('987,654,321,012,345,678')
        expect(() => formatTokenAmountBestMatch(amount, mockTokenMetadata, true, true)).toThrow(
            'Amount is too large to be formatted'
        )
    })

    test('should handle rounding edge cases', () => {
        const amount = 999
        const unit = 'Token'
        tokenUtils.getUnitFromTokenMetadata.mockReturnValue(unit)
        i18n.formatNumber.mockReturnValue('10.00')
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadata, true, true)).toBe('10.00 Token')
    })

    test('should handle boundary amount values', () => {
        const amount = 1
        const unit = 'Token'
        tokenUtils.getUnitFromTokenMetadata.mockReturnValue(unit)
        i18n.formatNumber.mockReturnValue('0.01')
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadata, true, true)).toBe('0.01 Token')
    })

    test('should format amount with leading zeros', () => {
        const amount = 50
        const unit = 'Token'
        tokenUtils.getUnitFromTokenMetadata.mockReturnValue(unit)
        i18n.formatNumber.mockReturnValue('0.50')
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadata, true, true)).toBe('0.50 Token')
    })

    test('should handle rounding for different units', () => {
        const amount = 1999
        const unit = 'BTC'
        tokenUtils.getUnitFromTokenMetadata.mockReturnValue(unit)
        i18n.formatNumber.mockReturnValue('20.00')
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadata, true, true)).toBe('20.00 BTC')
    })

    test('should handle variations in significant digits', () => {
        const amount = 12345678901234
        const unit = 'Token'
        tokenUtils.getUnitFromTokenMetadata.mockReturnValue(unit)
        i18n.formatNumber.mockReturnValue('123,456,789,012.34')
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadata, true, true)).toBe('123,456,789,012.34 Token')
    })

    test('should handle maximum length of token metadata decimals', () => {
        const amount = 123456789012345
        const mockTokenMetadataMaxDecimals = { ...mockTokenMetadata, decimals: 5 }
        const unit = 'Token'
        tokenUtils.getUnitFromTokenMetadata.mockReturnValue(unit)
        i18n.formatNumber.mockReturnValue('1,234,567,890.12345')
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadataMaxDecimals, true, true)).toBe(
            '1,234,567,890.12345 Token'
        )
    })

    test('should handle boundary testing for token metadata decimals', () => {
        const amount = 100
        const mockTokenMetadataBoundaryDecimals = { ...mockTokenMetadata, decimals: 0 }
        const unit = 'Token'
        tokenUtils.getUnitFromTokenMetadata.mockReturnValue(unit)
        i18n.formatNumber.mockReturnValue('1')
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadataBoundaryDecimals, true, true)).toBe('1 Token')
    })

    test('should test different rounding mechanisms', () => {
        const amount = 1457
        const unit = 'Token'
        tokenUtils.getUnitFromTokenMetadata.mockReturnValue(unit)
        i18n.formatNumber.mockReturnValue('14.57')
        expect(formatTokenAmountBestMatch(amount, mockTokenMetadata, true, true)).toBe('14.57 Token')
    })
})
