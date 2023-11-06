import { DateUnit } from '@core/utils/enums/filters'

export type DateFilterInput = SingleDateFilterInput | RangeDateFilterInput | UnitDateFilterInput

export type SingleDateFilterInput = {
    type: 'single'
    value: number | undefined
}

export type UnitDateFilterInput = {
    type: 'unit'
    amount: number | undefined
    unit: DateUnit
}

export type RangeDateFilterInput = {
    type: 'range'
    start: number | undefined
    end: number | undefined
}
