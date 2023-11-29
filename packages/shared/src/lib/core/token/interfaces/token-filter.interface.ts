import {
    NetworkFilterUnit,
    OrderFilterUnit,
    SelectionFilterUnit,
} from '@core/utils/interfaces/filter/filter-unit.interface'

export interface TokenFilter {
    verificationStatus: SelectionFilterUnit
    network: NetworkFilterUnit
    showHidden: SelectionFilterUnit
    order: OrderFilterUnit
}
