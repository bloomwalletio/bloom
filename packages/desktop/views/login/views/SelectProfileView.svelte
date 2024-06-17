<script lang="ts">
    import { onMount } from 'svelte'
    import { Button, IconName } from '@bloomwalletio/ui'
    import { initialiseOnboardingProfile, onboardingProfile } from '@contexts/onboarding'
    import { AppContext, isLatestStrongholdVersion } from '@core/app'
    import { localize } from '@core/i18n'
    import { IPersistedProfile, ProfileType, removeProfileFolder } from '@core/profile'
    import { destroyProfileManager } from '@core/profile-manager/actions'
    import { loadPersistedProfileIntoActiveProfile, resetActiveProfile } from '@core/profile/actions'
    import { profiles } from '@core/profile/stores'
    import { loginRouter, routerManager } from '@core/router'
    import features from '@features/features'
    import { LoggedOutLayout } from '@views/components'
    import { OnboardingRouter, onboardingRouter } from '@views/onboarding'
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

        // Ensure there is no active profile set from previous app activity
        resetActiveProfile()
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
    <profile-card-list
        class="grid max-w-[80vw] max-h-full overflow-auto box-content
        pl-24 pr-24 -mr-4 my-auto pt-[4.75rem] pb-16 gap-5 items-center"
    >
        {#each $profiles as profile}
            <ProfileCard {profile} onClick={onContinueClick} updateRequired={updateRequiredForProfile(profile)} />
        {/each}
    </profile-card-list>
</LoggedOutLayout>

<style lang="postcss">
    :global(profile-card-list) {
        --profile-card-width: 14rem;
    }

    profile-card-list {
        grid-template-columns: repeat(auto-fit, minmax(var(--profile-card-width, 1fr), 1fr));
    }
</style>
