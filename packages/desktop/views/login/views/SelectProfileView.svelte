<script lang="ts">
    import { LogoName } from '@auxiliary/logo/enums'
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
    import { Logo } from '@ui'
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

<LoggedOutLayout>
    <Logo slot="header" width="150" logo={LogoName.BloomLogoFull} />
    <div
        slot="content"
        class="
        card-conatiner flex flex-row grow w-full justify-center gap-8 overflow-auto overlay-scrollbar pb-8
        {$profiles.length > 4 ? 'grid grid-cols-4 2xl:grid-cols-5' : ''}"
    >
        {#each $profiles as profile}
            <ProfileCard {profile} onClick={onContinueClick} updateRequired={updateRequiredForProfile(profile)} />
        {/each}
    </div>
    <svelte:fragment slot="footer">
        {#if features.login.selectProfile.createNewProfile.enabled}
            <hr class="border-white dark:border-gray-800" />
            <button type="button" on:click={onAddProfileClick}>
                <Button variant="text" text={localize('general.addProfile')} icon={IconName.Plus} />
            </button>
        {/if}
    </svelte:fragment>
</LoggedOutLayout>

<style lang="postcss">
    .card-conatiner {
        width: 80%;
    }

    button {
        @apply bg-transparent h-full w-full flex justify-center gap-2 text-violet-500 font-bold py-8 duration-300;
        transition-property: background;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
            background: linear-gradient(to left, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.75), rgba(0, 0, 0, 0));
        }
    }

    button:after {
        content: '';
        @apply absolute h-full w-1/2 bg-violet-700 blur-3xl opacity-40 left-1/2 -bottom-20 -translate-x-1/2;
    }
</style>
