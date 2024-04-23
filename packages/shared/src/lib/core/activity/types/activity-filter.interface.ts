import {
    TokenFilterUnit,
    DateFilterUnit,
    NumberFilterUnit,
    SelectionFilterUnit,
} from '@core/utils/interfaces/filter/filter-unit.interface'

export interface ActivityFilter {
    amount: NumberFilterUnit
    status: SelectionFilterUnit
    type: SelectionFilterUnit
    direction: SelectionFilterUnit
    internalExternal: SelectionFilterUnit
    token: TokenFilterUnit
    date: DateFilterUnit
    showRejected: SelectionFilterUnit
    showHidden: SelectionFilterUnit
    showSpam: SelectionFilterUnit
}
