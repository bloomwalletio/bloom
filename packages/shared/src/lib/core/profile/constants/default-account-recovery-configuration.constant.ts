import { ProfileType } from '../enums'
import { AccountRecoveryConfiguration } from '../types'

export const DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION: AccountRecoveryConfiguration = {
    [ProfileType.Ledger]: {
        initialAccountRange: 3,
        accountGapLimit: 0,
        numberOfRoundsBetweenBreadthSearch: 1,
        addressGapLimit: 5,
    },
    [ProfileType.Software]: {
        initialAccountRange: 10,
        accountGapLimit: 0,
        numberOfRoundsBetweenBreadthSearch: 1,
        addressGapLimit: 100,
    },
}
