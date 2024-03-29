<script lang="ts">
    import { PasswordInput } from '@bloomwalletio/ui'
    import { showNotification } from '@auxiliary/notification'
    import { updateOnboardingProfile, verifyAndStoreMnemonic } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { MAX_STRONGHOLD_PASSWORD_LENGTH } from '@core/profile'
    import { setStrongholdPassword } from '@core/profile-manager'
    import { Subrouter } from '@core/router'
    import { PASSWORD_REASON_MAP } from '@core/stronghold'
    import { OnboardingLayout } from '@views/components'
    import { StrengthMeter } from '@ui'
    import zxcvbn from 'zxcvbn'

    export let router: Subrouter<unknown>

    let strongholdPassword = ''
    let confirmedStrongholdPassword = ''
    let lastCheckedStrongholdPassword = ''
    let error = ''
    let errorConfirm = ''
    let busy = false

    $: passwordStrength = checkPasswordStrength(strongholdPassword) ?? passwordStrength
    $: strongholdPassword, confirmedStrongholdPassword, ((error = ''), (errorConfirm = ''))

    async function onContinueClick(): Promise<void> {
        error = ''
        errorConfirm = ''

        if (strongholdPassword.length > MAX_STRONGHOLD_PASSWORD_LENGTH) {
            error = localize('error.password.length', {
                values: {
                    length: MAX_STRONGHOLD_PASSWORD_LENGTH,
                },
            })
        } else if (passwordStrength?.score !== 4) {
            let errKey = 'error.password.tooWeak'
            if (passwordStrength?.feedback.warning && PASSWORD_REASON_MAP[passwordStrength?.feedback.warning]) {
                errKey = `error.password.${PASSWORD_REASON_MAP[passwordStrength?.feedback.warning]}`
            }
            error = localize(errKey)
        } else if (strongholdPassword !== confirmedStrongholdPassword) {
            errorConfirm = localize('error.password.doNotMatch')
        } else {
            try {
                busy = true
                await setStrongholdPassword(strongholdPassword)
                await verifyAndStoreMnemonic()
                updateOnboardingProfile({ strongholdPassword, hasStoredMnemonic: true })
                router.next()
            } catch (err) {
                console.error(err)
                showNotification({
                    variant: 'error',
                    text: localize(err?.error),
                })
            } finally {
                busy = false
            }
        }
    }

    function onBackClick(): void {
        router.previous()
    }

    function checkPasswordStrength(password: string): unknown {
        const NUMBER_OF_STRENGTH_VALIDATION_CHARS = 64
        const limitedPassword = password.substring(0, NUMBER_OF_STRENGTH_VALIDATION_CHARS - 1)
        const hasCheckedPasswordChanged = lastCheckedStrongholdPassword !== limitedPassword
        if (hasCheckedPasswordChanged) {
            lastCheckedStrongholdPassword = limitedPassword
            return zxcvbn(limitedPassword)
        }
    } // zxcvbn lib recommends to not validate long passwords because of performance issues https://github.com/dropbox/zxcvbn#user-content-performance
</script>

<OnboardingLayout
    title={localize('views.onboarding.shared.encryptMnemonic.title')}
    description={localize('views.onboarding.shared.encryptMnemonic.description')}
    continueButton={{
        form: 'password-form',
        onClick: onContinueClick,
        disabled: !strongholdPassword || !confirmedStrongholdPassword,
    }}
    backButton={{
        onClick: onBackClick,
    }}
    {busy}
>
    <form on:submit|preventDefault={onContinueClick} id="password-form" slot="content" class="flex flex-col space-y-5">
        <StrengthMeter strength={passwordStrength?.score ?? 0} />
        <div class="flex flex-col gap-4">
            <PasswordInput
                bind:error
                bind:value={strongholdPassword}
                label={localize('general.password')}
                autofocus
                disabled={busy}
            />
            <PasswordInput
                bind:error={errorConfirm}
                bind:value={confirmedStrongholdPassword}
                label={localize('general.confirmPassword')}
                disabled={busy}
            />
        </div>
    </form>
</OnboardingLayout>
