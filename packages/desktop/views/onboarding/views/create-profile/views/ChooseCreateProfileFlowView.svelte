<script lang="ts">
    import {
        CreateProfileType,
        initialiseProfileManagerFromOnboardingProfile,
        onboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { getOnboardingNetworkTypeFromNetworkId } from '@core/network/utils'
    import { ProfileType, removeProfileFolder } from '@core/profile'
    import { destroyProfileManager } from '@core/profile-manager/actions'
    import features from '@features/features'
    import { OnboardingLayout } from '@views/components'
    import { onMount } from 'svelte'
    import { ButtonTile } from '../../../../components'
    import { createProfileRouter } from '../create-profile-router'
    import { IconName } from '@bloomwalletio/ui'

    const networkId = $onboardingProfile?.network?.id
    const networkType = getOnboardingNetworkTypeFromNetworkId(networkId)

    const busyMap = {
        [CreateProfileType.Mnemonic]: false,
        [CreateProfileType.Ledger]: false,
    }

    $: busy = Object.values(busyMap).some((busy) => busy)

    let selectedCreateProfileType: CreateProfileType | undefined = undefined
    function onProfileTypeClick(createProfileType: CreateProfileType): void {
        if (createProfileType === selectedCreateProfileType) {
            void onContinueClick()
        } else {
            selectedCreateProfileType = createProfileType
        }
    }

    async function onContinueClick(): Promise<void> {
        busyMap[selectedCreateProfileType] = true
        const type = selectedCreateProfileType === CreateProfileType.Ledger ? ProfileType.Ledger : ProfileType.Software
        updateOnboardingProfile({ createProfileType: selectedCreateProfileType, type })
        await initialiseProfileManagerFromOnboardingProfile()
        $createProfileRouter.next()
    }

    function onBackClick(): void {
        $createProfileRouter.previous()
    }

    onMount(async () => {
        // Clean up if user has navigated back to this view
        if ($onboardingProfile.hasInitialisedProfileManager) {
            await destroyProfileManager()
            await removeProfileFolder($onboardingProfile.id)
        }
        updateOnboardingProfile({ type: undefined, createProfileType: undefined, hasInitialisedProfileManager: false })
    })
</script>

<OnboardingLayout
    title={localize('views.onboarding.createProfile.chooseCreateProfileFlow.title')}
    continueButton={{
        onClick: onContinueClick,
        disabled: !selectedCreateProfileType,
    }}
    backButton={{
        onClick: onBackClick,
    }}
    {busy}
>
    <div slot="content" class="flex flex-col space-y-3">
        <ButtonTile
            primaryText={localize('views.onboarding.createProfile.chooseCreateProfileFlow.software.primary')}
            secondaryText={localize('views.onboarding.createProfile.chooseCreateProfileFlow.software.secondary')}
            icon={IconName.Folder}
            iconColor="orange"
            hidden={features?.onboarding?.[networkType]?.newProfile?.softwareProfile?.hidden}
            disabled={!features?.onboarding?.[networkType]?.newProfile?.softwareProfile?.enabled || busy}
            onClick={() => onProfileTypeClick(CreateProfileType.Mnemonic)}
            selected={selectedCreateProfileType === CreateProfileType.Mnemonic}
        />
        <ButtonTile
            primaryText={localize('views.onboarding.createProfile.chooseCreateProfileFlow.hardware.primary')}
            secondaryText={localize('views.onboarding.createProfile.chooseCreateProfileFlow.hardware.secondary')}
            icon={IconName.Hardware}
            iconColor="success"
            hidden={features?.onboarding?.[networkType]?.newProfile?.ledgerProfile?.hidden}
            disabled={!features?.onboarding?.[networkType]?.newProfile?.ledgerProfile?.enabled || busy}
            onClick={() => onProfileTypeClick(CreateProfileType.Ledger)}
            selected={selectedCreateProfileType === CreateProfileType.Ledger}
        />
    </div>
</OnboardingLayout>
