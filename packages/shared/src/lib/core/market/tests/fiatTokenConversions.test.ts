import { ITokenWithBalance, TokenStandard, TokenVerification } from '@core/token'
import { getFiatAmountFromTokenValue } from '../actions/getFiatAmountFromTokenValue'
import { getTokenAmountFromFiatValue } from '../actions/getTokenAmountFromFiatValue'

const MOCK_MARKET_PRICE = 0.05
const MOCK_TOKEN_AMOUNT = 1_000_000
const TOKEN: ITokenWithBalance = {
    id: '0x',
    standard: TokenStandard.BaseToken,
    metadata: {
        standard: TokenStandard.BaseToken,
        name: 'Shimmer',
        unit: 'Shimmer',
        decimals: 6,
    },
    hidden: false,
    verification: TokenVerification,
    networkId: 'tip32:shimmer',
    balance: {
        total: 10000,
    },
}

jest.mock('../actions/getMarketPriceForToken', () => ({
    getMarketPriceForToken: () => MOCK_MARKET_PRICE,
}))

describe('file: getFiatAmountFromTokenValue', () => {
    it('should return the correct fiat amount', () => {
        const result = getFiatAmountFromTokenValue(BigInt(MOCK_TOKEN_AMOUNT), TOKEN)
        expect(result).toBe(MOCK_MARKET_PRICE)
    })
})

describe('file: getTokenAmountFromFiatValue', () => {
    it('should return the correct token amount', () => {
        const result = getTokenAmountFromFiatValue(MOCK_MARKET_PRICE.toString(), TOKEN)
        expect(result).toBe(MOCK_TOKEN_AMOUNT.toString())
    })
})
