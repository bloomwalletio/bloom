import { DEFAULT_BASE_TOKEN, SupportedNetworkId } from '@core/network'
import { TokenStandard } from '../enums'
import { TokenMetadata } from '../types'
import { convertToRawAmount } from '../utils'
import Big from 'big.js'
import { MAX_SUPPORTED_DECIMALS } from '@core/wallet/constants'

const WEB3_TOKEN_METADATA: TokenMetadata = {
    name: 'RAWR',
    tickerSymbol: 'RAWR',
    unit: 'RAWR',
    decimals: 60,
    subunit: 'MEOW',
    useMetricPrefix: false,
    standard: TokenStandard.BaseToken,
}

const IRC30_TOKEN_HIGH_DECIMALS_METADATA: TokenMetadata = {
    standard: TokenStandard.Irc30,
    name: 'Test Token',
    symbol: 'TEST',
    decimals: 100000,
}
const IRC30_TOKEN_LOW_DECIMALS_METADATA: TokenMetadata = {
    standard: TokenStandard.Irc30,
    name: 'Test Token',
    symbol: 'TEST',
    decimals: 6,
}
const INVALID_TOKEN_METADATA: TokenMetadata = {
    standard: 'IRC1000',
    name: 'Bad Token',
    symbol: 'BAD',
    decimals: 0,
}

describe('File: convertToRawAmount.ts', () => {
    it('should return undefined if amount is empty', () => {
        expect(convertToRawAmount('', INVALID_TOKEN_METADATA)).toStrictEqual(undefined)
    })

    describe('given the tokenMetadata standard is BaseToken', () => {
        describe("given useMetricPrefix is false (currently Shimmer's case)", () => {
            const networkId = SupportedNetworkId.Shimmer
            it("should return Big(amount) * decimal property if selectedUnit is unit and baseToken's decimal is less than MAX_SUPPORTED_DECIMALS", () => {
                let value = convertToRawAmount('1', DEFAULT_BASE_TOKEN[networkId], 'SMR')?.toString() ?? '0'
                expect(Big(value)).toStrictEqual(Big(10).pow(DEFAULT_BASE_TOKEN[networkId].decimals))
            })
            it("should return XXX if selectedUnit is unit and baseToken's decimals property is greater than MAX_SUPPORTED_DECIMALS", () => {
                let value = convertToRawAmount('1', WEB3_TOKEN_METADATA, 'RAWR')?.toString() ?? '0'
                expect(Big(value)).toStrictEqual(Big(10).pow(WEB3_TOKEN_METADATA.decimals))
            })
            it('should return same Big(amount) if selectedUnit is subunit', () => {
                let value = convertToRawAmount('1', DEFAULT_BASE_TOKEN[networkId], 'glow')?.toString() ?? '0'
                expect(Big(value)).toStrictEqual(Big('1'))
            })
            it('should return tokens unit if no unit is provided', () => {
                let value = convertToRawAmount('1', DEFAULT_BASE_TOKEN[networkId])?.toString() ?? '0'
                expect(Big(value)).toStrictEqual(Big(10).pow(DEFAULT_BASE_TOKEN[networkId].decimals))
            })
            it('should return undefined if provided unit does not match the tokenMetadata unit or subunit', () => {
                expect(convertToRawAmount('1', DEFAULT_BASE_TOKEN[networkId], 'test')).toStrictEqual(undefined)
            })
        })
    })
    describe('given the tokenMetadata standard is Irc30', () => {
        it('should depend on tokenMetadata.decimals if tokenMetadata.decimals <= MAX_SUPPORTED_DECIMALS', () => {
            let value = convertToRawAmount('1', IRC30_TOKEN_LOW_DECIMALS_METADATA)?.toString() ?? '0'
            expect(Big(value)).toStrictEqual(Big(10).pow(IRC30_TOKEN_LOW_DECIMALS_METADATA.decimals))
        })
        it('should depend on tokenMetadata.decimals if > tokenMetadata.decimals if MAX_SUPPORTED_DECIMALS', () => {
            let value = convertToRawAmount('1', IRC30_TOKEN_HIGH_DECIMALS_METADATA)?.toString() ?? '0'
            expect(Big(value)).toStrictEqual(Big(10).pow(IRC30_TOKEN_HIGH_DECIMALS_METADATA.decimals))
        })
    })
    it('should throw an error if tokenMetadata standard is not BaseToken or Irc30', () => {
        expect(() => {
            convertToRawAmount('invalid amount', INVALID_TOKEN_METADATA)
        }).toThrow(new Error('convertToRawAmountFromMetadata: Invalid token standard'))
    })
})
