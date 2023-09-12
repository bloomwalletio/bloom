<script lang="ts">
    import { migrateStrongholdFromOnboardingProfile } from '@contexts/onboarding/actions'
    import { localize } from '@core/i18n'
    import { migrateStrongholdFromActiveProfile } from '@core/profile/actions/active-profile'
    import { isValidJson } from '@core/utils'
    import { Button, PasswordInput, Text } from '@ui'
    import { HTMLButtonType } from '@ui/enums'
    import { OnboardingLayout } from '@views/components'
    import { updateStrongholdRouter } from '../update-stronghold-router'

    export let password: string = ''
    export let isRecovery: boolean = false

    let passwordError: string = ''
    let busy = false

    async function onSubmit(): Promise<void> {
        try {
            busy = true
            if (isRecovery) {
                await migrateStrongholdFromOnboardingProfile(password)
            } else {
                await migrateStrongholdFromActiveProfile(password)
            }
            busy = false
            $updateStrongholdRouter.next()
        } catch (err) {
            busy = false
            const message = err?.message ?? ''
            const parsedError = isValidJson(message) ? JSON.parse(message) : ''
            passwordError = parsedError?.payload?.error.replaceAll('`', '') ?? localize(message)
            return
        }
    }

    function onBackClick(): void {
        $updateStrongholdRouter.previous()
    }
</script>

<OnboardingLayout
    title={localize('views.updateStronghold.update.title')}
    description={localize(`views.updateStronghold.update.${isRecovery ? 'recoveryBody' : 'loginBody'}`)}
    continueButton={{
        onClick: onSubmit,
        disabled: !password || !!passwordError,
    }}
    backButton={{
        onClick: onBackClick,
    }}
    {busy}
>
    <div slot="content">
        <Text secondary classes="mb-12">
            {localize(`views.updateStronghold.update.${isRecovery ? 'recoveryBody' : 'loginBody'}`)}
        </Text>
        <form on:submit|preventDefault={onSubmit} id="update-stronghold-form">
            <PasswordInput bind:value={password} bind:error={passwordError} autofocus showRevealToggle />
        </form>
        <Button
            type={HTMLButtonType.Submit}
            form="update-stronghold-form"
            classes="w-full"
            disabled={busy || !password || !!passwordError}
            isBusy={busy}
        >
            {localize('actions.updateAndContinue')}
        </Button>
    </div>
</OnboardingLayout>
