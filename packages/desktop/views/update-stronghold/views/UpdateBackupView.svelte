<script lang="ts">
    import { showNotification } from '@auxiliary/notification'
    import { Alert, Button } from '@bloomwalletio/ui'
    import { updateOnboardingProfile } from '@contexts/onboarding/stores'
    import { exportStronghold } from '@contexts/settings/actions'
    import { localize } from '@core/i18n'
    import { login } from '@core/profile/actions'
    import { OnboardingLayout } from '@views/components'
    import { updateStrongholdRouter } from '../update-stronghold-router'

    export let busy = false
    export let changedPassword: boolean
    export let isRecovery = false
    export let password: string

    function onAdvanceView(): void {
        if (isRecovery) {
            updateOnboardingProfile({
                mnemonic: null,
                strongholdPassword: null,
                importFile: null,
                importFilePath: null,
            })
        } else {
            void login()
        }

        $updateStrongholdRouter.next()
    }

    function onSkipClick(): void {
        onAdvanceView()
    }

    async function onBackupClick(): Promise<void> {
        try {
            await exportStronghold(password, handleExportStrongholdResponse)
            onAdvanceView()
        } catch (err) {
            console.error(err)
        }
    }

    function handleExportStrongholdResponse(cancelled: boolean, error: string): void {
        if (!cancelled) {
            if (error) {
                showNotification({
                    variant: 'error',
                    text: localize(error),
                })
            } else {
                showNotification({
                    variant: 'success',
                    text: localize('general.exportingStrongholdSuccess'),
                })
            }
        }
    }

    function onBackClick(): void {
        $updateStrongholdRouter.previous()
    }
</script>

<OnboardingLayout
    title={localize('views.updateStronghold.updateBackup.title')}
    description={localize(`views.updateStronghold.updateBackup.${isRecovery ? 'recoveryBody' : 'loginBody'}`)}
    continueButton={{
        text: localize('actions.skip'),
        onClick: onSkipClick,
        disabled: changedPassword || busy,
    }}
    backButton={{
        onClick: onBackClick,
        disabled: busy,
    }}
>
    <div slot="content" class="space-y-4">
        <Alert variant="warning" text={localize('views.updateStronghold.updateBackup.hint')} />
        <Button text={localize('actions.saveBackup')} width="full" {busy} on:click={onBackupClick} />
    </div>
</OnboardingLayout>
