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
    import { ButtonTile } from '../../../../components'
    import { restoreProfileRouter } from '../restore-profile-router'
    import { IconName } from '@bloomwalletio/ui'

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
        if (restoreProfileType === selectedRestoreProfileType) {
            onContinueClick()
        } else {
            selectedRestoreProfileType = restoreProfileType
        }
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
    title={localize('views.onboarding.restoreProfile.chooseRestoreProfileFlow.title', {
        network: displayedNetworkName,
    })}
    continueButton={{
        onClick: onContinueClick,
        disabled: !selectedRestoreProfileType,
    }}
    backButton={{
        onClick: onBackClick,
    }}
    {busy}
>
    <div slot="content" class="flex flex-col space-y-3">
        <ButtonTile
            primaryText={localize('views.onboarding.restoreProfile.chooseRestoreProfileFlow.mnemonic.primary')}
            secondaryText={localize('views.onboarding.restoreProfile.chooseRestoreProfileFlow.mnemonic.secondary')}
            icon={IconName.Keyboard}
            iconColor="info"
            hidden={features?.onboarding?.[networkType]?.restoreProfile?.recoveryPhrase?.hidden}
            disabled={!features?.onboarding?.[networkType]?.restoreProfile?.recoveryPhrase?.enabled || busy}
            onClick={() => onProfileTypeClick(RestoreProfileType.Mnemonic)}
            selected={selectedRestoreProfileType === RestoreProfileType.Mnemonic}
        />
        <ButtonTile
            primaryText={localize('views.onboarding.restoreProfile.chooseRestoreProfileFlow.file.primary')}
            secondaryText={localize('views.onboarding.restoreProfile.chooseRestoreProfileFlow.file.secondary')}
            icon={IconName.Folder}
            iconColor="orange"
            hidden={features?.onboarding?.[networkType]?.restoreProfile?.strongholdBackup?.hidden}
            disabled={!features?.onboarding?.[networkType]?.restoreProfile?.strongholdBackup?.enabled || busy}
            onClick={() => onProfileTypeClick(RestoreProfileType.Stronghold)}
            selected={selectedRestoreProfileType === RestoreProfileType.Stronghold}
        />
        <ButtonTile
            primaryText={localize('views.onboarding.restoreProfile.chooseRestoreProfileFlow.hardware.primary')}
            secondaryText={localize('views.onboarding.restoreProfile.chooseRestoreProfileFlow.hardware.secondary')}
            icon={IconName.Hardware}
            iconColor="success"
            hidden={features?.onboarding?.[networkType]?.restoreProfile?.ledgerBackup?.hidden}
            disabled={!features?.onboarding?.[networkType]?.restoreProfile?.ledgerBackup?.enabled || busy}
            onClick={() => onProfileTypeClick(RestoreProfileType.Ledger)}
            selected={selectedRestoreProfileType === RestoreProfileType.Ledger}
        />
    </div>
</OnboardingLayout>
