import { TokenStandard } from '@core/token/enums'
import { IGetAddressBalanceOptions } from '../interfaces'

export const DEFAULT_GET_ADDRESS_BALANCE_OPTIONS: IGetAddressBalanceOptions = {
    types: [TokenStandard.Erc20],
}
