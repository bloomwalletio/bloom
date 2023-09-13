<script lang="ts">
    import { showNotification } from '@auxiliary/notification'
    import { Alert } from '@bloomwalletio/ui'
    import { onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { MAX_STRONGHOLD_PASSWORD_LENGTH } from '@core/profile'
    import { initialiseProfileManager } from '@core/profile-manager/actions'
    import { changeStrongholdPassword } from '@core/profile-manager/api'
    import { profileManager } from '@core/profile-manager/stores'
    import { buildProfileManagerOptionsFromProfileData } from '@core/profile-manager/utils'
    import { unlockStronghold } from '@core/profile/actions'
    import { activeProfile, updateActiveProfile } from '@core/profile/stores'
    import { PASSWORD_REASON_MAP } from '@core/stronghold'
    import { Button, PasswordInput } from '@ui'
    import { HTMLButtonType } from '@ui/enums'
    import { OnboardingLayout } from '@views/components'
    import { onMount } from 'svelte'
    import zxcvbn from 'zxcvbn'
    import { updateStrongholdRouter } from '../update-stronghold-router'

    export let oldPassword: string
    export let newPassword: string
    export let isRecovery: boolean

    let passwordError: string = ''
    let confirmPassword: string = ''
    let isChangeBusy: boolean = false
    let isSkipBusy: boolean = false

    $: passwordStrength = zxcvbn(newPassword)
    $: busy = isChangeBusy || isSkipBusy

    $: newPassword, confirmPassword, (passwordError = '')

    function validatePassword(): boolean {
        isChangeBusy = false

        if (!newPassword || newPassword.length > MAX_STRONGHOLD_PASSWORD_LENGTH) {
            passwordError = localize('error.password.length', {
                values: {
                    length: MAX_STRONGHOLD_PASSWORD_LENGTH,
                },
            })
            return false
        } else if (newPassword !== confirmPassword) {
            passwordError = localize('error.password.doNotMatch')
            return false
        } else if (passwordStrength.score !== 4) {
            let errorLocale = 'error.password.tooWeak'
            if (passwordStrength.feedback.warning && PASSWORD_REASON_MAP[passwordStrength.feedback.warning]) {
                errorLocale = `error.password.${PASSWORD_REASON_MAP[passwordStrength.feedback.warning]}`
            }
            passwordError = localize(errorLocale)
            return false
        } else if (newPassword === oldPassword) {
            passwordError = localize('error.password.sameAsOld')
            return false
        } else {
            return true
        }
    }

    async function onChangeClick(): Promise<void> {
        const isPasswordValid = validatePassword()

        if (isPasswordValid) {
            try {
                isChangeBusy = true
                await changeStrongholdPassword(oldPassword, newPassword)
                if ($onboardingProfile) {
                    updateOnboardingProfile({ strongholdPassword: newPassword })
                }
                showNotification({
                    variant: 'success',
                    text: localize('general.passwordSuccess'),
                })
                $updateStrongholdRouter.next()
            } catch (err) {
                console.error(err)
                passwordError = localize('error.password.incorrect')
            } finally {
                isChangeBusy = false
            }
        }
    }

    async function onSkipClick(): Promise<void> {
        try {
            isSkipBusy = true
            newPassword = ''
            confirmPassword = ''
            await unlockStronghold(oldPassword)
            $updateStrongholdRouter.next()
        } catch (err) {
            handleError(err)
        } finally {
            isSkipBusy = false
        }
    }

    onMount(async () => {
        if (!isRecovery && !$profileManager) {
            const profileManagerOptions = await buildProfileManagerOptionsFromProfileData($activeProfile)
            const { storagePath, coinType, clientOptions, secretManager } = profileManagerOptions
            updateActiveProfile({ clientOptions })
            const manager = await initialiseProfileManager(
                storagePath,
                coinType,
                clientOptions,
                secretManager,
                $activeProfile?.id
            )
            profileManager.set(manager)
        }
    })
</script>

<OnboardingLayout
    title={localize('views.settings.changePassword.title')}
    continueButton={{
        text: localize('actions.skip'),
        onClick: onSkipClick,
        disabled: busy,
    }}
    backButton={{
        disabled: true,
    }}
    busy={isSkipBusy}
>
    <div slot="content" class="space-y-4">
        <Alert variant="warning" text={localize('views.updateStronghold.changePassword.hint')} />
        <form on:submit|preventDefault={onChangeClick} id="update-stronghold-form" class="space-y-4">
            <PasswordInput
                bind:value={newPassword}
                showRevealToggle
                strengthLevels={4}
                showStrengthLevel
                strength={passwordStrength.score}
                placeholder={localize('general.password')}
                label={localize('general.password')}
                disabled={busy}
                submitHandler={validatePassword}
            />
            <PasswordInput
                bind:error={passwordError}
                bind:value={confirmPassword}
                showRevealToggle
                placeholder={localize('general.confirmPassword')}
                label={localize('general.confirmPassword')}
                disabled={busy}
                submitHandler={validatePassword}
            />
        </form>
        <Button
            form="update-stronghold-form"
            type={HTMLButtonType.Submit}
            classes="w-full"
            disabled={!newPassword || !confirmPassword || busy}
            isBusy={isChangeBusy}
        >
            {localize('views.settings.changePassword.title')}
        </Button>
    </div>
</OnboardingLayout>
