import { ProfileType } from '@core/profile/enums'

export function isLedgerProfile(profileType: ProfileType): boolean {
    return profileType === ProfileType.Ledger
}
