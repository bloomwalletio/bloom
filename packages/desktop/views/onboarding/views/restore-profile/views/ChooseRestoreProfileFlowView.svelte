<script lang="ts">
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
    import { OnboardingLayout } from '@views/components'
    import { onMount } from 'svelte'
    import { OnboardingSelectorTile } from '../../../components'
    import { restoreProfileRouter } from '../restore-profile-router'

    const networkId = $onboardingProfile?.network?.id
    const networkType = getOnboardingNetworkTypeFromNetworkId(networkId)
    const displayedNetworkName = $onboardingProfile?.network?.name

    const busyMap = {
        [RestoreProfileType.Mnemonic]: false,
        [RestoreProfileType.Stronghold]: false,
        [RestoreProfileType.Ledger]: false,
    }

    $: busy = Object.values(busyMap).some((busy) => busy)

    let selectedRestoreProfileType: RestoreProfileType | undefined = undefined
    function onProfileTypeClick(restoreProfileType: RestoreProfileType): void {
        selectedRestoreProfileType = restoreProfileType
    }

    async function onContinueClick(): Promise<void> {
        busyMap[selectedRestoreProfileType] = true
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
    continueButton={{
        onClick: onContinueClick,
        disabled: !selectedRestoreProfileType,
    }}
    backButton={{
        onClick: onBackClick,
    }}
    {busy}
>
    <div slot="content" class="flex flex-col space-y-4">
        <OnboardingSelectorTile
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importMnemonic')}
            secondaryText={localize('views.onboarding.profileSetup.setupRecovered.importMnemonicDescription')}
            icon="language"
            hidden={features?.onboarding?.[networkType]?.restoreProfile?.recoveryPhrase?.hidden}
            disabled={!features?.onboarding?.[networkType]?.restoreProfile?.recoveryPhrase?.enabled || busy}
            onClick={() => onProfileTypeClick(RestoreProfileType.Mnemonic)}
            selected={selectedRestoreProfileType === RestoreProfileType.Mnemonic}
        />
        <OnboardingSelectorTile
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importFile')}
            secondaryText={localize('views.onboarding.profileSetup.setupRecovered.importFileDescription')}
            icon="file"
            hidden={features?.onboarding?.[networkType]?.restoreProfile?.strongholdBackup?.hidden}
            disabled={!features?.onboarding?.[networkType]?.restoreProfile?.strongholdBackup?.enabled || busy}
            onClick={() => onProfileTypeClick(RestoreProfileType.Stronghold)}
            selected={selectedRestoreProfileType === RestoreProfileType.Stronghold}
        />
        <OnboardingSelectorTile
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importLedger')}
            secondaryText={localize('views.onboarding.profileSetup.setupRecovered.importLedgerDescription')}
            icon="chip"
            hidden={features?.onboarding?.[networkType]?.restoreProfile?.ledgerBackup?.hidden}
            disabled={!features?.onboarding?.[networkType]?.restoreProfile?.ledgerBackup?.enabled || busy}
            onClick={() => onProfileTypeClick(RestoreProfileType.Ledger)}
            selected={selectedRestoreProfileType === RestoreProfileType.Ledger}
        />
    </div>
</OnboardingLayout>
