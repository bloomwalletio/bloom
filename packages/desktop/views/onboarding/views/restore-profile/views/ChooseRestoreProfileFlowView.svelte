<script lang="ts">
    import { OnboardingLayout } from '@components'
    import {
        RestoreProfileType,
        initialiseProfileManagerFromOnboardingProfile,
        onboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { getOnboardingNetworkTypeFromNetworkId } from '@core/network'
    import { ProfileType, removeProfileFolder } from '@core/profile'
    import { destroyProfileManager } from '@core/profile-manager/actions'
    import features from '@features/features'
    import { OnboardingButton } from '@ui'
    import { onMount } from 'svelte'
    import { restoreProfileRouter } from '../restore-profile-router'

    const networkId = $onboardingProfile?.network?.id
    const networkType = getOnboardingNetworkTypeFromNetworkId(networkId)
    const displayedNetworkName = $onboardingProfile?.network?.name

    let isBusy = {
        [RestoreProfileType.Mnemonic]: false,
        [RestoreProfileType.Stronghold]: false,
        [RestoreProfileType.Ledger]: false,
    }

    $: isDisabled = Object.values(isBusy).some((busy) => busy)

    let selectedRestoreProfileType: RestoreProfileType | undefined = undefined
    function onProfileTypeClick(restoreProfileType: RestoreProfileType): void {
        selectedRestoreProfileType = restoreProfileType
    }

    async function onContinueClick(): Promise<void> {
        isBusy = { ...isBusy, [selectedRestoreProfileType]: true }
        const type =
            selectedRestoreProfileType === RestoreProfileType.Ledger ? ProfileType.Ledger : ProfileType.Software
        updateOnboardingProfile({ type, restoreProfileType: selectedRestoreProfileType })
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

<OnboardingLayout
    title={localize('views.onboarding.profileSetup.setupRecovered.title', {
        network: displayedNetworkName,
    })}
    description={localize('views.onboarding.profileSetup.setupRecovered.body')}
    {onContinueClick}
    disableContinue={!selectedRestoreProfileType}
    {onBackClick}
>
    <div slot="content" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importMnemonic')}
            secondaryText={localize('views.onboarding.profileSetup.setupRecovered.importMnemonicDescription')}
            icon="language"
            busy={isBusy[RestoreProfileType.Mnemonic]}
            hidden={features?.onboarding?.[networkType]?.restoreProfile?.recoveryPhrase?.hidden}
            disabled={!features?.onboarding?.[networkType]?.restoreProfile?.recoveryPhrase?.enabled || isDisabled}
            onClick={() => onProfileTypeClick(RestoreProfileType.Mnemonic)}
            selected={selectedRestoreProfileType === RestoreProfileType.Mnemonic}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importFile')}
            secondaryText={localize('views.onboarding.profileSetup.setupRecovered.importFileDescription')}
            icon="file"
            busy={isBusy[RestoreProfileType.Stronghold]}
            hidden={features?.onboarding?.[networkType]?.restoreProfile?.strongholdBackup?.hidden}
            disabled={!features?.onboarding?.[networkType]?.restoreProfile?.strongholdBackup?.enabled || isDisabled}
            onClick={() => onProfileTypeClick(RestoreProfileType.Stronghold)}
            selected={selectedRestoreProfileType === RestoreProfileType.Stronghold}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importLedger')}
            secondaryText={localize('views.onboarding.profileSetup.setupRecovered.importLedgerDescription')}
            icon="chip"
            busy={isBusy[RestoreProfileType.Ledger]}
            hidden={features?.onboarding?.[networkType]?.restoreProfile?.ledgerBackup?.hidden}
            disabled={!features?.onboarding?.[networkType]?.restoreProfile?.ledgerBackup?.enabled || isDisabled}
            onClick={() => onProfileTypeClick(RestoreProfileType.Ledger)}
            selected={selectedRestoreProfileType === RestoreProfileType.Ledger}
        />
    </div>
</OnboardingLayout>
