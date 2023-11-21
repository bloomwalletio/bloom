import { TokenStandard } from '@core/token/enums'

export interface IGetAddressBalanceOptions {
    types?: TokenStandard[]
    withMetadata?: boolean
}
