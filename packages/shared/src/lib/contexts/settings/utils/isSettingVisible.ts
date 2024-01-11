import { ISetting } from '../interfaces'

export function isSettingVisible(
    setting: ISetting,
    isEnabledInFeatures: boolean,
    isLoggedIn: boolean,
    isLedgerProfile: boolean
): boolean {
    const loginChecked = !setting.requiresLogin || (setting.requiresLogin && isLoggedIn)
    const passedSoftwareCheck =
        !setting.requiresSoftwareProfile || (setting.requiresSoftwareProfile && !isLedgerProfile)
    const passedLedgerChecked = !setting.requiresLedgerProfile || (setting.requiresLedgerProfile && isLedgerProfile)

    return isEnabledInFeatures && loginChecked && passedLedgerChecked && passedSoftwareCheck
}
