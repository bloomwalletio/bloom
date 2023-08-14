import { ProfileType } from '../enums'

export type AccountRecoveryProfileConfiguration = {
    initialAccountRange: number
    accountGapLimit: number
    numberOfRoundsBetweenBreadthSearch: number
    addressGapLimit: number
}

export type AccountRecoveryConfiguration = {
    [key in ProfileType]?: AccountRecoveryProfileConfiguration
}
