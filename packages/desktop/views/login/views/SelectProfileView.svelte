<script lang="ts">
    import { Button, IconName } from '@bloomwalletio/ui'
    import { initialiseOnboardingProfile, onboardingProfile } from '@contexts/onboarding'
    import {
        AppContext,
        isLatestStrongholdVersion,
        needsToAcceptLatestPrivacyPolicy,
        needsToAcceptLatestTermsOfService,
    } from '@core/app'
    import { localize } from '@core/i18n'
    import { IPersistedProfile, ProfileType, removeProfileFolder } from '@core/profile'
    import { destroyProfileManager } from '@core/profile-manager/actions'
    import { loadPersistedProfileIntoActiveProfile } from '@core/profile/actions'
    import { profiles } from '@core/profile/stores'
    import { loginRouter, routerManager } from '@core/router'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { LoggedOutLayout } from '@views/components'
    import { OnboardingRouter, onboardingRouter } from '@views/onboarding'
    import { onMount } from 'svelte'
    import { ProfileCard } from '../components'

    function onContinueClick(profileId: string): void {
        loadPersistedProfileIntoActiveProfile(profileId)
        $loginRouter.next()
    }

    async function onAddProfileClick(): Promise<void> {
        onboardingRouter.set(new OnboardingRouter())
        await initialiseOnboardingProfile()
        $routerManager.goToAppContext(AppContext.Onboarding)
    }

    $: if (needsToAcceptLatestPrivacyPolicy() || needsToAcceptLatestTermsOfService()) {
        openPopup({
            id: PopupId.LegalUpdate,
            hideClose: true,
            preventClose: true,
        })
    }

    function updateRequiredForProfile(profile: IPersistedProfile): boolean {
        return (
            profile?.type === ProfileType.Software &&
            !isLatestStrongholdVersion(profile?.strongholdVersion) &&
            features.onboarding.strongholdVersionCheck.enabled
        )
    }

    onMount(async () => {
        // Clean up if user has navigated back to this view from onboarding
        if ($onboardingProfile) {
            if ($onboardingProfile.hasInitialisedProfileManager) {
                await destroyProfileManager()
                await removeProfileFolder($onboardingProfile.id)
            }
            $onboardingProfile = undefined
        }
    })
</script>

<LoggedOutLayout glass>
    <Button
        slot="button"
        variant="outlined"
        size="sm"
        text={localize('general.addProfile')}
        icon={IconName.Plus}
        on:click={onAddProfileClick}
    />
    <profile-list class="overlay-scrollbar">
        {#each $profiles as profile}
            <ProfileCard {profile} onClick={onContinueClick} updateRequired={updateRequiredForProfile(profile)} />
        {/each}
    </profile-list>
</LoggedOutLayout>

<style lang="postcss">
    profile-list {
        --profile-card-width: 14rem;
        @apply grid gap-8 overflow-auto pr-4 -mr-4;
        @apply max-w-[80vw] h-full mt-[4.75rem];
        grid-template-columns: repeat(auto-fill, minmax(var(--profile-card-width), 1fr));
    }
</style>
