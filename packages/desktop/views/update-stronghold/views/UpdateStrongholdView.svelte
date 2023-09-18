<script lang="ts">
    import { PasswordInput } from '@ui'
    import { OnboardingLayout } from '@views/components'
    import { migrateStrongholdFromOnboardingProfile } from '@contexts/onboarding/actions'
    import { localize } from '@core/i18n'
    import { migrateStrongholdFromActiveProfile } from '@core/profile/actions/active-profile'
    import { isValidJson } from '@core/utils'
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
            $updateStrongholdRouter.next()
        } catch (err) {
            const message = err?.message ?? ''
            const parsedError = isValidJson(message) ? JSON.parse(message) : ''
            passwordError = parsedError?.payload?.error.replaceAll('`', '') ?? localize(message)
        } finally {
            busy = false
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
        <form on:submit|preventDefault={onSubmit} id="update-stronghold-form">
            <PasswordInput bind:value={password} bind:error={passwordError} autofocus showRevealToggle />
        </form>
    </div>
</OnboardingLayout>
