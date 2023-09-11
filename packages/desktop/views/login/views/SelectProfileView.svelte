<script lang="ts">
    import { Icon, IconName } from '@bloomwalletio/ui'
    import { ProfileCard } from '../components'
    import { initialiseOnboardingProfile, onboardingProfile } from '@contexts/onboarding'
    import { AppContext, needsToAcceptLatestPrivacyPolicy, needsToAcceptLatestTermsOfService } from '@core/app'
    import { localize } from '@core/i18n'
    import { removeProfileFolder } from '@core/profile'
    import { destroyProfileManager } from '@core/profile-manager/actions'
    import { loadPersistedProfileIntoActiveProfile } from '@core/profile/actions'
    import { profiles } from '@core/profile/stores'
    import { loginRouter, routerManager } from '@core/router'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { Logo } from '@ui'
    import { OnboardingRouter, onboardingRouter } from '@views/onboarding'
    import { onMount } from 'svelte'

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

<select-profile-view
    class="flex flex-col justify-between items-center h-full bg-slate-100 dark:bg-gray-900 w-screen h-screen"
>
    <header class="w-full flex items-center mb-8">
        <logo-container class="pl-12 mt-12 block">
            <Logo width="150" logo="logo-bloom-full" />
        </logo-container>
    </header>
    <div
        class="
        card-conatiner flex flex-row w-full justify-center gap-8 overflow-y-auto overlay-scrollbar
        {$profiles.length > 4 ? 'grid grid-cols-4' : ''}"
    >
        {#each $profiles as profile}
            <ProfileCard {profile} onClick={onContinueClick} />
        {/each}
    </div>
    <footer class="flex flex-col w-full relative">
        <hr class="border-white dark:border-gray-800" />
        <button type="button" on:click={onAddProfileClick}>
            <Icon name={IconName.Plus} size="sm" />
            {localize('general.addProfile')}
        </button>
    </footer>
</select-profile-view>

<style lang="postcss">
    select-profile-view > div {
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

    .card-conatiner {
        max-width: 1000px;
    }
</style>
