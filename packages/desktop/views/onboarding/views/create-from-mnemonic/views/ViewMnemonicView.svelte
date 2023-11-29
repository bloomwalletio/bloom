<script lang="ts">
    import { Button, IconName } from '@bloomwalletio/ui'
    import {
        generateMnemonicForOnboardingProfile,
        onboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { downloadRecoveryKit } from '@core/utils'
    import { RecoveryPhrase } from '@ui'
    import { OnboardingLayout } from '@views/components'
    import { onMount } from 'svelte'
    import { createFromMnemonicRouter } from '../create-from-mnemonic-router'

    function onContinueClick(): void {
        $createFromMnemonicRouter.next()
    }

    function onBackClick(): void {
        updateOnboardingProfile({ mnemonic: undefined, hasVerifiedMnemonic: false, hasStoredMnemonic: false })
        $createFromMnemonicRouter.previous()
    }

    function onDownloadClick(): void {
        downloadRecoveryKit()
    }

    onMount(() => {
        if (!$onboardingProfile?.mnemonic) {
            generateMnemonicForOnboardingProfile()
        }
    })
</script>

<OnboardingLayout
    title={localize('views.onboarding.createFromMnemonic.viewMnemonic.title')}
    description={localize('views.onboarding.createFromMnemonic.viewMnemonic.description')}
    continueButton={{
        onClick: onContinueClick,
        text: localize('actions.continue'),
    }}
    backButton={{
        onClick: onBackClick,
    }}
>
    <content slot="content" class="flex flex-col justify-center gap-4">
        <RecoveryPhrase recoveryPhrase={$onboardingProfile?.mnemonic} />
        <Button
            icon={IconName.Download}
            variant="text"
            on:click={onDownloadClick}
            text={localize('actions.downloadRecoveryKit')}
        />
    </content>
</OnboardingLayout>
