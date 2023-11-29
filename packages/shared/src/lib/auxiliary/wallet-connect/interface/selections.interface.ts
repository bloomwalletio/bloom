import { IAccountState } from '@core/account/interfaces'

export interface ISelections {
    chains?: string[]
    methods?: string[]
    accounts?: IAccountState[]
}
