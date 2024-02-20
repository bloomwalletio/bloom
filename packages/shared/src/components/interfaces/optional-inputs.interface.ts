export interface IOptionalInputs {
    [key: string]: IOptionalInput
}

export interface IOptionalInput {
    inputType: 'text' | 'number'
    isInteger?: boolean
    value: string
    error: string
    isOpen?: boolean
}
