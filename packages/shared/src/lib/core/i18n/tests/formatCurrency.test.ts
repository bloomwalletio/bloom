import { formatCurrency } from '../utils'
import { appSettings } from '@core/app/stores'

describe('File: formatCurrency.ts', () => {
    beforeEach(() => {
        appSettings.update((state) => ({ ...state, language: 'en' }))
    })

    it('returns empty string for undefined raw amount', () => {
        const parsedAmount = formatCurrency(undefined)
        expect(parsedAmount).toBe('')
    })
    it('returns empty string for random string', () => {
        const parsedAmount = formatCurrency('hello world')
        expect(parsedAmount).toBe('')
    })
    it('should work with regular numbers', () => {
        const amount = '42069.2365489'
        const parsedAmount = formatCurrency(amount)
        expect(parsedAmount).toBe('$42069.24')
    })
    it('should work with decimals', () => {
        const amount = '0.00001234568'
        const parsedAmount = formatCurrency(amount)
        expect(parsedAmount).toBe('$0.000012')
    })
    it('should take into consideration the currency', () => {
        const amount = '42069.2365489'
        const parsedAmount = formatCurrency(amount, 'EUR')
        expect(parsedAmount).toBe('€42069.24')
    })
    it('should take into consideration the locale', () => {
        appSettings.update((state) => ({ ...state, language: 'de' }))
        const amount = '42069.2365489'
        const parsedAmount = formatCurrency(amount, 'EUR')
        // The space is a non-breaking space
        expect(parsedAmount).toEqual('42069,24\u00A0€')
    })
    it('should work with scientific notation', () => {
        const amount = '4.2069e16'
        const parsedAmount = formatCurrency(amount)
        expect(parsedAmount).toBe('$42069000000000000.00')
    })
})
