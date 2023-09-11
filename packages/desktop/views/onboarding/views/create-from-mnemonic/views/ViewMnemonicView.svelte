<script lang="ts">
    import { Button, Text } from '@bloomwalletio/ui'
    import { OnboardingLayout } from '@components'
    import {
        generateMnemonicForOnboardingProfile,
        onboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { downloadRecoveryKit } from '@core/utils'
    import { RecoveryPhrase } from '@ui'
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
    title={localize('views.onboarding.profileBackup.viewMnemonic.title')}
    description={localize('views.onboarding.profileBackup.viewMnemonic.body1')}
    {onContinueClick}
    {onBackClick}
>
    <content slot="content">
        <Text>
            {localize('views.onboarding.profileBackup.viewMnemonic.body2')}
        </Text>
        <Text>{localize('views.onboarding.profileBackup.viewMnemonic.body3')}</Text>
        <RecoveryPhrase recoveryPhrase={$onboardingProfile?.mnemonic} boxed />
        <Button variant="text" on:click={onDownloadClick} text={localize('actions.downloadRecoveryKit')} />
    </content>
</OnboardingLayout>
