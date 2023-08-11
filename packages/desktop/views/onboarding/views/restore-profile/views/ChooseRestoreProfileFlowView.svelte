<script lang="ts">
    import { OnboardingLayout } from '@components'
    import {
        RestoreProfileType,
        initialiseProfileManagerFromOnboardingProfile,
        onboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { getDisplayedNameFromNetworkName, getNetworkNameFromNetworkId } from '@core/network'
    import { ProfileType, removeProfileFolder } from '@core/profile'
    import features from '@features/features'
    import { Animation, OnboardingButton, Text, TextType } from '@ui'
    import { onMount } from 'svelte'
    import { restoreProfileRouter } from '../restore-profile-router'
    import { destroyProfileManager } from '@core/profile-manager/actions'

    let isBusy = {
        [RestoreProfileType.Mnemonic]: false,
        [RestoreProfileType.Stronghold]: false,
        [RestoreProfileType.Ledger]: false,
    }

    $: isDisabled = Object.values(isBusy).some((busy) => busy)

    $: networkId = $onboardingProfile?.network?.id
    $: networkName = getNetworkNameFromNetworkId(networkId)

    async function onProfileTypeClick(restoreProfileType: RestoreProfileType): Promise<void> {
        isBusy = { ...isBusy, [restoreProfileType]: true }
        const type = restoreProfileType === RestoreProfileType.Ledger ? ProfileType.Ledger : ProfileType.Software
        updateOnboardingProfile({ type, restoreProfileType })
        await initialiseProfileManagerFromOnboardingProfile()
        $restoreProfileRouter.next()
    }

    function onBackClick(): void {
        $restoreProfileRouter.previous()
    }

    onMount(async () => {
        // Clean up if user has navigated back to this view
        if ($onboardingProfile.hasInitialisedProfileManager) {
            await destroyProfileManager()
            await removeProfileFolder($onboardingProfile.id)
        }
        updateOnboardingProfile({ type: undefined, restoreProfileType: undefined, hasInitialisedProfileManager: false })
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type={TextType.h2}
            >{localize('views.onboarding.profileSetup.setupRecovered.title', {
                values: { network: getDisplayedNameFromNetworkName(networkName) },
            })}</Text
        >
    </div>
    <div slot="leftpane__content">
        <Text secondary classes="mb-8">{localize('views.onboarding.profileSetup.setupRecovered.body')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importMnemonic')}
            secondaryText={localize('views.onboarding.profileSetup.setupRecovered.importMnemonicDescription')}
            icon="language"
            busy={isBusy[RestoreProfileType.Mnemonic]}
            hidden={features?.onboarding?.[networkName]?.restoreProfile?.recoveryPhrase?.hidden}
            disabled={!features?.onboarding?.[networkName]?.restoreProfile?.recoveryPhrase?.enabled || isDisabled}
            onClick={() => onProfileTypeClick(RestoreProfileType.Mnemonic)}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importFile')}
            secondaryText={localize('views.onboarding.profileSetup.setupRecovered.importFileDescription')}
            icon="file"
            busy={isBusy[RestoreProfileType.Stronghold]}
            hidden={features?.onboarding?.[networkName]?.restoreProfile?.strongholdBackup?.hidden}
            disabled={!features?.onboarding?.[networkName]?.restoreProfile?.strongholdBackup?.enabled || isDisabled}
            onClick={() => onProfileTypeClick(RestoreProfileType.Stronghold)}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importLedger')}
            secondaryText={localize('views.onboarding.profileSetup.setupRecovered.importLedgerDescription')}
            icon="chip"
            busy={isBusy[RestoreProfileType.Ledger]}
            hidden={features?.onboarding?.[networkName]?.restoreProfile?.ledgerBackup?.hidden}
            disabled={!features?.onboarding?.[networkName]?.restoreProfile?.ledgerBackup?.enabled || isDisabled}
            onClick={() => onProfileTypeClick(RestoreProfileType.Ledger)}
        />
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-purple dark:bg-gray-900">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
