export type NumberFilterInput = SingleNumberFilterInput | RangeNumberFilterInput

export type SingleNumberFilterInput = {
    type: 'single'
    amount: number
}

export type RangeNumberFilterInput = {
    type: 'range'
    start: number
    end: number
}
