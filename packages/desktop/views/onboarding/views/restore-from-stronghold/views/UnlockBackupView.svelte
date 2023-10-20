<script lang="ts">
    import { PasswordInput } from '@bloomwalletio/ui'
    import { showNotification } from '@auxiliary/notification'
    import { restoreBackupFromStrongholdFile, updateOnboardingProfile } from '@contexts/onboarding'
    import { CLIENT_ERROR_REGEXES, ClientError } from '@core/error'
    import { localize } from '@core/i18n'
    import { OnboardingLayout } from '@views/components'
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
    title={localize('views.onboarding.profileRecovery.unlockBackup.title')}
    description={localize('views.onboarding.profileRecovery.unlockBackup.body')}
    continueButton={{
        onClick: onContinueClick,
        disabled: !strongholdPassword,
    }}
    backButton={{
        onClick: onBackClick,
    }}
    {busy}
>
    <PasswordInput
        bind:value={strongholdPassword}
        slot="content"
        label={localize('general.password')}
        bind:error
        disabled={busy}
        autofocus
        on:submit={onContinueClick}
    />
</OnboardingLayout>
