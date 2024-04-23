import { NetworkFilterUnit, SelectionFilterUnit } from '@core/utils/interfaces/filter/filter-unit.interface'

export interface INftFilter {
    network: NetworkFilterUnit
    showHidden: SelectionFilterUnit
}
