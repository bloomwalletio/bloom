<script lang="ts">
    import { showNotification } from '@auxiliary/notification'
    import { OnboardingLayout } from '@components'
    import { restoreBackupFromStrongholdFile, updateOnboardingProfile } from '@contexts/onboarding'
    import { CLIENT_ERROR_REGEXES, ClientError } from '@core/error'
    import { localize } from '@core/i18n'
    import { PasswordInput, Text } from '@ui'
    import { onMount } from 'svelte'
    import { restoreFromStrongholdRouter } from '../restore-from-stronghold-router'

    export let error = ''
    export let busy = false

    let strongholdPassword = ''
    $: strongholdPassword, (error = '')

    async function onContinueClick(): Promise<void> {
        if (strongholdPassword) {
            busy = true
            try {
                await restoreBackupFromStrongholdFile(strongholdPassword)
                updateOnboardingProfile({ strongholdPassword })
                $restoreFromStrongholdRouter.next()
            } catch (err) {
                if (CLIENT_ERROR_REGEXES[ClientError.InvalidStrongholdPassword].test(err?.error)) {
                    error = localize('error.password.incorrect')
                } else {
                    console.error(err)
                    showNotification({
                        variant: 'error',
                        text: localize('error.global.generic'),
                    })
                }
            } finally {
                busy = false
            }
        }
    }

    function onBackClick(): void {
        // We are deliberately using "isGettingMigrationData"
        // We do not want to display the spinner if stronghold is being imported.
        if (!busy) {
            $restoreFromStrongholdRouter.previous()
        }
    }

    onMount(() => {
        updateOnboardingProfile({ strongholdPassword: undefined, lastStrongholdBackupTime: undefined })
    })
</script>

<OnboardingLayout
    title={`${localize('general.import')} ${localize('general.stronghold')}`}
    description={localize('views.onboarding.profileRecovery.backupPassword.body1')}
    continueButton={{
        onClick: onContinueClick,
        disabled: !strongholdPassword,
    }}
    backButton={{
        onClick: onBackClick,
    }}
    {busy}
>
    <div slot="content">
        <Text type="p" secondary classes="mb-8"
            >{localize('views.onboarding.profileRecovery.backupPassword.body2')}</Text
        >
        <PasswordInput
            classes="mb-6"
            {error}
            bind:value={strongholdPassword}
            showRevealToggle
            autofocus
            disabled={busy}
            submitHandler={onContinueClick}
        />
    </div>
</OnboardingLayout>
