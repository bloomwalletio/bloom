import { DateUnit } from '@core/utils/enums/filters'

export type DateFilterInput = SingleDateFilterInput | RangeDateFilterInput | UnitDateFilterInput

export type SingleDateFilterInput = {
    type: 'single'
    value: string | undefined
}

export type UnitDateFilterInput = {
    type: 'unit'
    amount: number
    unit: DateUnit
}

export type RangeDateFilterInput = {
    type: 'range'
    start: string | undefined
    end: string | undefined
}
