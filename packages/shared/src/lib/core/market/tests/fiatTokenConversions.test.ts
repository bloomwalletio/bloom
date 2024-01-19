import { ITokenWithBalance, TokenStandard, TokenVerification } from '@core/token'
import { getFiatValueFromTokenAmount } from '../actions/getFiatValueFromTokenAmount'

const MOCK_MARKET_PRICE = 0.000005
const MOCK_TOKEN_AMOUNT = BigInt(1_000_000_000_000_000_000)
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
        total: BigInt(10000),
    },
}

jest.mock('../actions/getMarketPriceForToken', () => ({
    getMarketPriceForToken: () => MOCK_MARKET_PRICE,
}))

describe('file: getFiatValueFromTokenAmount', () => {
    it('should return the correct fiat amount', () => {
        const result = getFiatValueFromTokenAmount(MOCK_TOKEN_AMOUNT, TOKEN)
        expect(result).toBe('5000000')
    })
})
