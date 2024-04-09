<script lang="ts">
    import { Button, PasswordInput } from '@bloomwalletio/ui'
    import { StrengthMeter } from '@ui'
    import { exportStronghold } from '@contexts/settings'
    import { localize } from '@core/i18n'
    import { MAX_STRONGHOLD_PASSWORD_LENGTH } from '@core/profile'
    import { changePasswordAndUnlockStronghold } from '@core/profile-manager'
    import { PASSWORD_REASON_MAP } from '@core/stronghold'
    import zxcvbn from 'zxcvbn'
    import SettingsSection from '../SettingsSection.svelte'

    let exportStrongholdChecked: boolean

    let currentPassword = ''
    let currentPasswordError = ''
    let newPassword = ''
    let confirmedPassword = ''
    let busy = false
    let newPasswordError = ''

    $: passwordStrength = zxcvbn(newPassword)

    async function changePassword(): Promise<void> {
        if (isPasswordValid()) {
            busy = true

            try {
                await changePasswordAndUnlockStronghold(currentPassword, newPassword)
                if (exportStrongholdChecked) {
                    void exportStronghold(newPassword, cancelStrongholdExport)
                    return
                }
                resetPasswordsOnSuccess()
            } catch (err) {
                console.error(err)
                currentPasswordError = 'error.password.incorrect'
            }
        }
    }

    function cancelStrongholdExport(cancelled: boolean, err: string): void {
        if (cancelled) {
            return
        }

        if (err) {
            currentPasswordError = err
            return
        }

        resetPasswordsOnSuccess()
    }

    function isPasswordValid(): boolean {
        if (currentPassword && newPassword && confirmedPassword) {
            resetErrors()

            if (newPassword.length > MAX_STRONGHOLD_PASSWORD_LENGTH) {
                newPasswordError = localize('error.password.length', {
                    values: {
                        length: MAX_STRONGHOLD_PASSWORD_LENGTH,
                    },
                })
                return false
            } else if (newPassword !== confirmedPassword) {
                newPasswordError = localize('error.password.doNotMatch')
                return false
            } else if (passwordStrength.score !== 4) {
                let errorLocale = 'error.password.tooWeak'
                if (passwordStrength.feedback.warning && PASSWORD_REASON_MAP[passwordStrength.feedback.warning]) {
                    errorLocale = `error.password.${PASSWORD_REASON_MAP[passwordStrength.feedback.warning]}`
                }
                newPasswordError = localize(errorLocale)
                return false
            }

            return true
        }
        return false
    }

    function resetErrors(): void {
        currentPasswordError = ''
        newPasswordError = ''
        busy = false
    }

    function resetPasswordsOnSuccess(): void {
        currentPassword = ''
        newPassword = ''
        confirmedPassword = ''
        exportStrongholdChecked = false
    }
</script>

<SettingsSection
    title={localize('views.settings.changePassword.title')}
    description={localize('views.settings.changePassword.description')}
>
    <form id="form-change-password" on:submit|preventDefault={changePassword}>
        <div class="flex flex-col w-2/3 gap-4 mb-6">
            <PasswordInput
                error={localize(currentPasswordError)}
                bind:value={currentPassword}
                label={localize('general.currentPassword')}
                disabled={busy}
            />
            <StrengthMeter strength={passwordStrength?.score ?? 0} />
            <PasswordInput bind:value={newPassword} label={localize('general.newPassword')} disabled={busy} />
            <PasswordInput
                error={newPasswordError}
                bind:value={confirmedPassword}
                label={localize('general.confirmNewPassword')}
                disabled={busy}
            />
        </div>
        <Button
            text={localize('views.settings.changePassword.title')}
            {busy}
            disabled={!currentPassword || !newPassword || !confirmedPassword || busy}
            type="submit"
        />
    </form>
</SettingsSection>
