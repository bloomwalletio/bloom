<script lang="ts">
    import { OnboardingLayout } from '@components'
    import { onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { ImportTextfield, Text } from '@ui'
    import { onMount } from 'svelte'
    import { restoreFromMnemonicRouter } from '../restore-from-mnemonic-router'

    let input = ''

    function onContinueClick(): void {
        const mnemonic = input.split(' ')
        updateOnboardingProfile({ mnemonic })
        $restoreFromMnemonicRouter.next()
    }

    function onBackClick(): void {
        $restoreFromMnemonicRouter.previous()
    }

    onMount(() => {
        // Clean up if user has navigated back to this view
        updateOnboardingProfile({ mnemonic: undefined, hasStoredMnemonic: false })
    })
</script>

<OnboardingLayout
    title={localize('views.onboarding.profileRecovery.importMnemonicPhrase.title')}
    description={localize('views.onboarding.profileRecovery.importMnemonicPhrase.body')}
    {onContinueClick}
    {onBackClick}
>
    <div slot="content">
        <Text type="h5" classes="mb-3">{localize('views.onboarding.profileRecovery.importMnemonicPhrase.enter')}</Text>
        <form on:submit|preventDefault={onContinueClick} id="text-import-form">
            <ImportTextfield type={$onboardingProfile?.restoreProfileType} bind:value={input} />
        </form>
    </div>
</OnboardingLayout>
