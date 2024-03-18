import {
    TokenFilterUnit,
    DateFilterUnit,
    NumberFilterUnit,
    SelectionFilterUnit,
} from '@core/utils/interfaces/filter/filter-unit.interface'
import { ActivityTypeFilterOption } from '../enums'

export interface ActivityFilter {
    amount: NumberFilterUnit
    status: SelectionFilterUnit
    type: SelectionFilterUnit<ActivityTypeFilterOption>
    direction: SelectionFilterUnit
    internalExternal: SelectionFilterUnit
    token: TokenFilterUnit
    date: DateFilterUnit
    showRejected: SelectionFilterUnit
    showHidden: SelectionFilterUnit
    showValueless: SelectionFilterUnit
}
