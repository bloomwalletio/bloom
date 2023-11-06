export type NumberFilterInput = SingleNumberFilterInput | RangeNumberFilterInput

export type SingleNumberFilterInput = {
    type: 'single'
    amount: number | undefined
}

export type RangeNumberFilterInput = {
    type: 'range'
    start: number | undefined
    end: number | undefined
}
