<script lang="ts">
    import { OnboardingLayout } from '@components'
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
    import { OnboardingButton } from '@ui'
    import { onMount } from 'svelte'
    import { createProfileRouter } from '../create-profile-router'

    const networkId = $onboardingProfile?.network?.id
    const networkType = getOnboardingNetworkTypeFromNetworkId(networkId)

    let isBusy = {
        [CreateProfileType.Mnemonic]: false,
        [CreateProfileType.Ledger]: false,
    }

    $: isDisabled = Object.values(isBusy).some((busy) => busy)

    let selectedCreateProfileType: CreateProfileType | undefined = undefined
    function onProfileTypeClick(createProfileType: CreateProfileType): void {
        selectedCreateProfileType = createProfileType
    }

    async function onContinueClick(): Promise<void> {
        isBusy = { ...isBusy, [selectedCreateProfileType]: true }
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
    title={localize('views.onboarding.profileSetup.setupNew.title')}
    description={localize('views.onboarding.profileSetup.setupNew.body')}
    {onContinueClick}
    disableContinue={!selectedCreateProfileType}
    {onBackClick}
>
    <div slot="content" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupNew.softwareAccount.title')}
            secondaryText={localize('views.onboarding.profileSetup.setupNew.softwareAccount.description')}
            icon="file"
            busy={isBusy[CreateProfileType.Mnemonic]}
            hidden={features?.onboarding?.[networkType]?.newProfile?.softwareProfile?.hidden}
            disabled={!features?.onboarding?.[networkType]?.newProfile?.softwareProfile?.enabled || isDisabled}
            onClick={() => onProfileTypeClick(CreateProfileType.Mnemonic)}
            selected={selectedCreateProfileType === CreateProfileType.Mnemonic}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupNew.ledgerAccount.title')}
            secondaryText={localize('views.onboarding.profileSetup.setupNew.ledgerAccount.description')}
            icon="chip"
            busy={isBusy[CreateProfileType.Ledger]}
            hidden={features?.onboarding?.[networkType]?.newProfile?.ledgerProfile?.hidden}
            disabled={!features?.onboarding?.[networkType]?.newProfile?.ledgerProfile?.enabled || isDisabled}
            onClick={() => onProfileTypeClick(CreateProfileType.Ledger)}
            selected={selectedCreateProfileType === CreateProfileType.Ledger}
        />
    </div>
</OnboardingLayout>
