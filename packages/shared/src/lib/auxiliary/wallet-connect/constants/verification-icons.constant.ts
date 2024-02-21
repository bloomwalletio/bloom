import { IconName } from '@bloomwalletio/ui'
import { DappVerification } from '../enums'

export const VERIFICATION_ICONS: {
    [key in DappVerification]: {
        icon: IconName
        color: 'warning' | 'success' | 'danger'
    }
} = {
    [DappVerification.Unknown]: {
        icon: IconName.ShieldOff,
        color: 'warning',
    },
    [DappVerification.Valid]: {
        icon: IconName.ShieldOn,
        color: 'success',
    },
    [DappVerification.Invalid]: {
        icon: IconName.ShieldOff,
        color: 'danger',
    },
    [DappVerification.Scam]: {
        icon: IconName.ShieldOff,
        color: 'danger',
    },
}
