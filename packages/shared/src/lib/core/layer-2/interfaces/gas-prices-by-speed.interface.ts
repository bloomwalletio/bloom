import { GasSpeed } from '../enums'

export interface IGasPricesBySpeed {
    [GasSpeed.Fast]?: bigint
    [GasSpeed.Average]?: bigint
    [GasSpeed.Slow]?: bigint
    [GasSpeed.Required]: bigint
}
