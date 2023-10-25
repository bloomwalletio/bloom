<script lang="ts">
    import { updateOnboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { MnemonicInput } from '../../../components'
    import { OnboardingLayout } from '@views/components'
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
    title={localize('views.onboarding.restoreFromMnemonic.inputMnemonic.title')}
    description={localize('views.onboarding.restoreFromMnemonic.inputMnemonic.description')}
    continueButton={{
        type: 'submit',
        form: 'text-import-form',
        onClick: onContinueClick,
        disabled: !input,
    }}
    backButton={{
        onClick: onBackClick,
    }}
>
    <form slot="content" on:submit|preventDefault={onContinueClick} id="text-import-form">
        <MnemonicInput bind:value={input} on:submit={onContinueClick} />
    </form>
</OnboardingLayout>
