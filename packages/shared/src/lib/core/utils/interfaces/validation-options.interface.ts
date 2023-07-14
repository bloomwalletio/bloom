export interface IValidationOptions {
    value: boolean | number | string
    isRequired?: boolean
    mustBeUnique?: boolean
    minLength?: number
    maxLength?: number
    checkLength?: boolean
}
